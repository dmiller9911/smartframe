import * as google from './utils/google';
import { getImages } from './utils/pictures';
import { startSlideShow } from './utils/slideshow';
import fs from 'fs';
import config from './config';

let hasRestarted = false;
let refreshInterval;
let slideshow;

// Create Picture Directory if it doesn't exist
try {
  fs.statSync(config.pictureDir);
} catch (err) {
  fs.mkdirSync(config.pictureDir);
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
  setTimeout(() => {
    process.kill(0);
  });
}

function startApp() {
  google.authenticate()
    .then(() => getImages(config.folderId))
    .then(() => {
      console.log('Done with Images.  Starting SlideShow');
      slideshow = startSlideShow();
      slideshow.on('error', handleSlideShowError);
      slideshow.on('close', handleSlideShowClose);
      refreshInterval = setInterval(() => getImages(), config.refreshTimeMs);
    })
    .catch(err => console.log(err));
}

startApp();
