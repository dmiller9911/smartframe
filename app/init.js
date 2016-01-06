import App from './app';
import BPromise from 'bluebird';
import fs from 'fs';
import Server from './server';
import AuthService from './modules/auth/auth.service';
import config from './config';

BPromise.promisifyAll(fs);

var server = new Server('Smartframe', 3000);
var app = new App(config.userGoogle.folderId, config.slideshow.dir, config.slideshow.fetchMinutes);

server.init();
server.listen();
app.start();
