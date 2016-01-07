import request from 'request';
import path from 'path';
import fs from 'fs';

export default class Downloader {
    constructor(dir) {
        this.dir = dir;
    }

    downloadFile(url, name, force) {
        var filePath = path.join(this.dir, name);

        return fs.statAsync(filePath)
        .then(function (result) {
            if (!force) {
                return "done";
            }
            return doDownload(url, filePath);
        })
        .catch(function (err) {
            return doDownload(url, filePath);
        });
    }
}

function doDownload(url, path) {
    return new Promise(function (resolve, reject) {
        return request(url)
            .on('error', function(err) {
                reject(err);
            })
            .pipe(fs.createWriteStream(path))
            .on('close', function () {
                resolve("done");
            });
    });
}
