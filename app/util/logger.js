import chalk from 'chalk';
import winston from 'winston';
import config from './../config';

const log = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            level: config.logLevel || 'info'
        })
    ]
});

class Logger {
    constructor(label) {
        this.label = label;
    }

    debug() {
        log.debug(this.label + ':', ...arguments);
    }

    info() {
        log.info(this.label + ':', ...arguments);
    }

    warn() {
        log.warn(this.label + ':', ...arguments);
    }

    error() {
        log.error(this.label + ':', ...arguments);
    }

}

export default Logger;