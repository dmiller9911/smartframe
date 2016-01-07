import db from './db/db';
import AuthService from './modules/auth/auth.service';
import Google from './modules/google';
import BPromise from 'bluebird';
import Downloader from './util/Downloader.js';
import _ from 'lodash';
import Slideshow from './modules/slideshow';
import path from 'path';
import config from './config';
import Logger from './util/Logger';

const auth = new AuthService();
const googleApi = new Google();

export default class App {
    constructor(folderId, slideShowDir, interval) {
        this.interval = interval * 60 * 1000;
        this.folderId = folderId;
        this.slideshowDir = slideShowDir;
        this.downloader = new Downloader(path.join(process.cwd(), this.slideshowDir));
        this.slideshow = new Slideshow(path.join(process.cwd(), this.slideshowDir));
        this.log = new Logger('App');
        this.loop = null;
    }

    start() {
        this.log.info(`Starting main app. With interval of ${ this.interval } ms`);
        this.getPictures()
            .then(() => {
                this.slideshow.start(config.slideshow.rotateSeconds, config.slideshow.refreshSeconds);
                this.loop = setInterval(() => this.getPictures, this.interval);
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
        const dbItem = _.find(dbResults, {id: file.id});
        let picture;

        if (dbItem && dbItem.downloaded) {
            return dbItem;
        }

        return googleApi.drive.getFile(file.id)
            .then((result) => {
                picture = {
                    id: result.id,
                    name: result.title,
                    downloaded: false
                };
                if (!result.webContentLink) {
                    return picture;
                }
                return this.downloader.downloadFile(result.webContentLink, result.title)
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
        this.log.debug('Downloading Pictures', new Date());
        return this._authenticateApp()
            .then(() => {
                return BPromise.join(
                    this._listFoldersChildren(),
                    this._checkDbForExistingPictures()
                )
            })
            .spread((driveResults, dbResults) => {
                return BPromise.map(driveResults.items, (file) => {
                    return this._getFileAndDownload(file, dbResults)
                }, {concurrency: 4});
            })
            .then((results) => {
                return db.setItem('pictures', results);
            })
            .then(() => {
                this.log.debug("Finished Downloading Pictures", new Date());
            })
            .catch((err) => {
                return auth.authenticate()
                    .then(() => {
                        return this.getPictures();
                    });
            });
    }
}




