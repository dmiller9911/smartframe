import AuthService from './auth.service';


export default class AuthController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    authenticate() {
        var service = new AuthService();
        return service.authenticate();
    }

    handleOauthCallback() {
        let code = this.req.query.code;
        return new AuthService().getToken(code);
    }
}
