import AuthService from './auth.service';
import _ from 'lodash';
import { Router } from 'express';

export default class AuthController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.authService = new AuthService();
    }

    authenticate() {
        return this.authService.authenticate();
    }

    handleOauthCallback() {
        let code = this.req.query.code;
        return this.authService.getToken(code)
            .then((result) => {
                this.res.send(result);
            });
    }
}


