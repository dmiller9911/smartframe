import cors from 'cors';

export default class CorsMiddleware {
    constructor(app) {
        this.app = app;
    }

    init() {
        this.app.use(cors());
    }
}