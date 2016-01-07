import childProcess from 'child_process';
import Logger from './../../util/Logger';

export default class Slideshow {
    constructor(directory) {
        this.dir = directory;
        this.log = new Logger('Slideshow');
        this.slideshow;
    }

    start(delay = 15, reload = 30) {
        var  exec = childProcess.exec;

        this.log.debug(`Starting slideshow ${ this.dir } `);
        this.slideshow = exec(`feh -Y -x -q -D ${ delay } -R ${ reload } -B black -F -Z -z -r ${ this.dir }`);
    }

    stop(signal) {
        this.log.debug('Killing slideshow', this.dir);
        this.slideshow.kill();
    }
}
