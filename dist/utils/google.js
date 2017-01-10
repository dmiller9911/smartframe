'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticate = authenticate;
exports.getChildren = getChildren;
exports.getFile = getFile;

var _googleapis = require('googleapis');

var _googleapis2 = _interopRequireDefault(_googleapis);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var key = require(_config2.default.serviceKeyFilePath);
var drive = _googleapis2.default.drive('v2');

var jwtClient = new _googleapis2.default.auth.JWT(key.client_email, null, key.private_key, ['https://www.googleapis.com/auth/drive.readonly'], null);

function authenticate() {
  return new Promise(function (resolve, reject) {
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        return reject(err);
      }
      return resolve(tokens);
    });
  });
}

function getChildren(folderId) {
  var maxResults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;

  return new Promise(function (resolve, reject) {
    var req = {
      folderId: folderId,
      maxResults: maxResults,
      auth: jwtClient
    };
    drive.children.list(req, function (err, response) {
      if (err) {
        return reject(err);
      }
      return resolve(response);
    });
  });
}

function getFile(fileId) {
  var retryCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (retryCount > 3) {
    return Promise.reject();
  }
  var promise = new Promise(function (resolve, reject) {
    setTimeout(function () {
      drive.files.get({ fileId: fileId, auth: jwtClient }, function (err, response) {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    }, Math.floor(Math.random() * 1500) + 100);
  });

  return promise.catch(function (err) {
    if (err.code === 403) {
      return getFile(fileId, retryCount + 1);
    }
    return Promise.reject(err);
  });
}