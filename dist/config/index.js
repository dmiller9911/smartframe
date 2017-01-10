'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  serviceKeyFilePath: _path2.default.resolve(__dirname, '../../key.json'),
  pictureDir: _path2.default.resolve(__dirname, '../../pictures'),
  folderId: '0Bygu6DARgtsKWWlPZFZjRndYUVU',
  refreshTimeMs: 60 * 60 * 1000
};