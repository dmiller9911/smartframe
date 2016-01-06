import google from 'googleapis';
var drive = google.drive('v2');

export default class Drive {
    constructor() {

    }

    listChildren(folderId, maxResults = 1000) {
        var promise = new Promise(function (resolve, reject) {
            drive.children.list({ folderId: folderId, maxResults: maxResults }, function (err, response) {
                if (err) {
                    reject(err);
                }
                resolve(response);
            });
        });
        return promise;
    }

    getFile(fileId) {
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
                drive.files.get({fileId: fileId}, function (err, response) {
                    if (err) {
                        reject(err);
                    }
                    console.log("Resolved:", fileId);
                    resolve(response);
                });
            }, (Math.floor(Math.random() * 1500) + 100));
        });
        return promise
            .catch(function (err) {
                if (err.reason === "userRateLimitExceeded") {
                    console.log("Repeat:", fileId);
                    return self.getFile(fileId);
                }
                return Promise.reject(err);
            });
    }
}
