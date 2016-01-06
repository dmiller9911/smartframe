import cors from 'cors';

export default class CorsMiddleware {
    constructor(app) {
        app.use(cors());
    }
}