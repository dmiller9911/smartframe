import db from './db/db';
import AuthService from './modules/auth/auth.service';
import Google from './modules/google';
import BPromise from 'bluebird';
import Downloader from './util/downloader.util';
import _ from 'lodash';
import Slideshow from './modules/slideshow';
import path from 'path';
import config from './config';
import Logger from './util/logger';

var auth = new AuthService();
var googleApi = new Google();

export default class App {
    constructor(folderId, slideShowDir, interval) {
        this.interval = interval * 60 * 1000;
        this.folderId = folderId;
        this.slideshowDir = slideShowDir;
        this.downloader = new Downloader(path.join(process.cwd(), this.slideshowDir));
        this.slideshow = new Slideshow(path.join(process.cwd(), this.slideshowDir));
        this.log = new Logger('App');
        this.loop;
    }

    start() {
        var self = this;
        self.log.info(`Starting main app. With interval of ${ self.interval } ms`);
        self.getPictures()
            .then(function () {
                self.slideshow.start(config.slideshow.rotateSeconds, config.slideshow.refreshSeconds);
                self.loop = setInterval(self.getPictures.bind(self), self.interval);
            });
    }

    stop() {
        this.slideshow.stop();
        clearInterval(this.loop);
    }

    _authenticateApp() {
        return db.getItem('auth')
            .then(function (result) {
                if (!result) {
                    return auth.authenticate();
                }
                auth.setCredentials(result);
                return result;
            });
    }

    _listFoldersChildren() {
        return googleApi.drive.listChildren(this.folderId);
    }

    _checkDbForExistingPictures() {
        return db.getItem('pictures')
            .then(function (result) {
                result = result || [];
                return result;
            });
    }

    _getFileAndDownload(file, dbResults) {
        var self = this;
        var picture;
        var dbItem = _.find(dbResults, {id: file.id});

        if (dbItem && dbItem.downloaded) {
            return dbItem;
        }

        return googleApi.drive.getFile(file.id)
            .then(function (result) {
                picture = {
                    id: result.id,
                    name: result.title,
                    downloaded: false
                };
                if (!result.webContentLink) {
                    return picture;
                }
                return self.downloader.downloadFile(result.webContentLink, result.title)
                    .then(function (result) {
                        picture.downloaded = true;
                        return picture
                    });
            })
            .then(function () {
                return picture;
            });
    }

    getPictures() {
        var self = this;
        self.log.debug('Downloading Pictures', new Date());
        return self._authenticateApp()
            .then(function () {
                return BPromise.join(
                    self._listFoldersChildren(),
                    self._checkDbForExistingPictures()
                )
            })
            .spread(function (driveResults, dbResults)  {
                return BPromise.map(driveResults.items, function (file) {
                    return self._getFileAndDownload(file, dbResults)
                }, {concurrency: 4});
            })
            .then(function (results) {
                return db.setItem('pictures', results);
            })
            .then(function (result) {
                self.log.debug("Finished Downloading Pictures", new Date());
            })
            .catch(function (err) {
                return auth.authenticate()
                    .then(function () {
                        return self.getPictures();
                    });
            });
    }
}




