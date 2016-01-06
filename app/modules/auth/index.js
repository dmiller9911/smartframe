import AuthRoutes from './auth.routes';
import Logger from './../../util/logger';

export default class AuthModule {
    constructor(server) {
        this.logger = new Logger('Auth');
        this.routesV1 = new AuthRoutes(server.app);

        this.logger.debug('Auth Module loaded');
    }
}
