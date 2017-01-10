'use strict';

var _google = require('./utils/google');

var google = _interopRequireWildcard(_google);

var _pictures = require('./utils/pictures');

var _slideshow = require('./utils/slideshow');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var hasRestarted = false;
var refreshInterval = void 0;
var slideshow = void 0;

// Create Picture Directory if it doesn't exist
try {
  _fs2.default.statSync(_config2.default.pictureDir);
} catch (err) {
  _fs2.default.mkdirSync(_config2.default.pictureDir);
}

function teardownAndRestart() {
  if (hasRestarted) {
    return;
  }
  slideshow.kill(0);
  hasRestarted = true;
  clearInterval(refreshInterval);
  startApp(); // eslint-disable-line no-use-before-define
}

function handleSlideShowError() {
  teardownAndRestart();
}

function handleSlideShowClose() {
  console.log('Stopping Application');
  setTimeout(function () {
    process.kill(0);
  });
}

function startApp() {
  google.authenticate().then(function () {
    return (0, _pictures.getImages)(_config2.default.folderId);
  }).then(function () {
    console.log('Done with Images.  Starting SlideShow');
    slideshow = (0, _slideshow.startSlideShow)();
    slideshow.on('error', handleSlideShowError);
    slideshow.on('close', handleSlideShowClose);
    refreshInterval = setInterval(function () {
      return (0, _pictures.getImages)();
    }, _config2.default.refreshTimeMs);
  }).catch(function (err) {
    return console.log(err);
  });
}

startApp();