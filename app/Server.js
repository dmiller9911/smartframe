import express from 'express';
import Middleware from './middleware';
import Logger from './util/Logger';
import AuthModule from './modules/auth';

export default class Server {
    constructor(name = "Smartframe", port = 3000 ) {
        this.name = name;
        this.port = port;
        this.log = new Logger(this.name);
        this.app;
    }

    init() {
        this.app = express();

        this.middleware = new Middleware(this);

        //Load Pre Route Middleware
        this.middleware.preRoute(this);

        //Load Modules
        var auth = new AuthModule(this);

        //Load Post Route Middleware
        this.middleware.postRoute(this);

        return this;
    }

    listen() {
        this.app.listen(this.port);
        this.log.info(`${ this.name } started on port ${ this.port }`);
    }
}
