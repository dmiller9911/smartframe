import Logger from './../util/Logger';

import CorsMiddleware from './preRoute/CorsMiddleware.js';

export default class Middleware {
    constructor(server) {
        this.app = server.app;
        this.log = new Logger(`${ server.name } middleware`);
    }

    preRoute() {
        this.log.debug('Initializing Pre-Route App Middleware');
        new CorsMiddleware(this.app).init();
    }

    postRoute(app) {
        this.log.debug('Initializing Post-Route App Middleware');
    }
}
