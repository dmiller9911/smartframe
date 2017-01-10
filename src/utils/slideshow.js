import { exec } from 'child_process';
import config from '../config';

export function startSlideShow(delay = 15, reload = 30) {
  return exec(`feh -Y -x -q -D ${ delay } -R ${ reload } -B black -F -Z -z -r ${ config.pictureDir }`);
}

export function stopSlideShow(slideShowProcess) {
  slideShowProcess.kill(0);
}
