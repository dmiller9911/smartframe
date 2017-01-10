'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.getImages = getImages;

var _google = require('./google');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extensions = ['.jpg', '.jpeg', '.png'];

function getExtension(fileName) {
  return _path2.default.extname(fileName);
}

function buildLocalFileName(id, fileName) {
  return ('' + id + getExtension(fileName)).toLowerCase();
}

function getLocalPictures() {
  return new Promise(function (resolve, reject) {
    _fs2.default.readdir(_config2.default.pictureDir, function (err, files) {
      if (err) {
        return reject(err);
      }
      return resolve(files);
    });
  });
}

function containsDriveItem(itemId, localItems) {
  return localItems.some(function (localItem) {
    return extensions.some(function (ext) {
      return localItem.toLowerCase() === buildLocalFileName(itemId, 'test' + ext);
    });
  });
}

function filterFileList(driveItems, localItems) {
  return driveItems.filter(function (_ref) {
    var id = _ref.id;
    return !containsDriveItem(id, localItems);
  });
}

function downloadImage(downloadUrl, saveFilePath) {
  return new Promise(function (resolve, reject) {
    _axios2.default.get(downloadUrl, { responseType: 'stream' }).then(function (response) {
      response.data.on('error', function (err) {
        return reject(err);
      }).pipe(_fs2.default.createWriteStream(saveFilePath)).on('close', function () {
        return resolve();
      });
    });
  });
}

function fetchImageAndDownload(fileSummary) {
  return (0, _google.getFile)(fileSummary.id).then(function (file) {
    var localFilePath = _path2.default.join(_config2.default.pictureDir, buildLocalFileName(file.id, file.title));
    return downloadImage(file.webContentLink, localFilePath);
  });
}

function fileProgressLogger(total, newFiles) {
  var completed = 0;
  return function () {
    completed = completed += 1;
    var msg = 'Total Files: ' + total + ' | NewFiles: ' + newFiles + ' | Completed Files: ' + completed;
    process.stderr.cursorTo(0);
    process.stderr.write(msg);
    if (completed >= newFiles) {
      process.stderr.write('\n');
    }
    process.stderr.clearLine(1);
  };
}

function chunkNewFilePromises(newFiles, totalFiles) {
  var chunkSize = 25;
  var chunkArray = [];
  var progressLogger = fileProgressLogger(totalFiles.length, newFiles.length);
  for (var i = 0; i < newFiles.length; i += chunkSize) {
    chunkArray.push(newFiles.slice(i, i + chunkSize));
  }

  return chunkArray.reduce(function (prevPromise, itemsChunk) {
    return prevPromise.then(function () {
      return Promise.all(itemsChunk.map(function (item) {
        return fetchImageAndDownload(item).catch().then(function () {
          return progressLogger();
        });
      }));
    });
  }, Promise.resolve());
}

function getImages(folderId) {
  return Promise.all([(0, _google.getChildren)(folderId), getLocalPictures()]).then(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        driveItems = _ref3[0].items,
        localFiles = _ref3[1];

    var newFiles = filterFileList(driveItems, localFiles);
    return chunkNewFilePromises(newFiles, driveItems);
  });
}