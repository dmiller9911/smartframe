import { Router } from 'express';
import AuthController from './auth.controller';
import config from './../../config';
import path from 'path';

const AUTH_PATH = '/auth';

export default class AuthRoutes {
    constructor(app) {
        this.router = Router();
        this.app = app;
    }

    init() {
        this.router.get('/callback', (req, res)  => {
            return new AuthController(req, res).handleOauthCallback()
        });

        this.app.use(AUTH_PATH, this.router);

        return this;
    }
}
