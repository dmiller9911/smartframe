'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startSlideShow = startSlideShow;
exports.stopSlideShow = stopSlideShow;

var _child_process = require('child_process');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function startSlideShow() {
  var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 15;
  var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;

  return (0, _child_process.exec)('feh -Y -x -q -D ' + delay + ' -R ' + reload + ' -B black -F -Z -z -r ' + _config2.default.pictureDir);
}

function stopSlideShow(slideShowProcess) {
  slideShowProcess.kill(0);
}