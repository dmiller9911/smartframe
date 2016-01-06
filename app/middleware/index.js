import Logger from './../util/logger';

import CorsMiddleware from './preRoute/cors.middleware';

export default class Middleware {
    constructor(server) {
        this.app = server.app;
        this.log = new Logger(`${ server.name } middleware`);
    }

    preRoute() {
        this.log.debug('Initializing Pre-Route App Middleware');
        new CorsMiddleware(this.app);
    }

    postRoute(app) {
        this.log.debug('Initializing Post-Route App Middleware');
    }
}
