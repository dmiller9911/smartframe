import google from 'googleapis';
import config from './../../config';
import childProcess from 'child_process';
import db from './../../db/db';
import _ from 'lodash';
import events from 'events';
import Logger from './../../util/logger';

var eventEmitter = new events.EventEmitter();

const DB_AUTH_KEY = "auth";


var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(config.userGoogle.client_id, config.userGoogle.client_secret, config.google.redirect_uri);
google.options({ auth: oauth2Client});

var url = oauth2Client.generateAuthUrl({
    access_type: config.google.access_type, // 'online' (default) or 'offline' (gets refresh_token)
    scope: config.google.scopes // If you only need one scope you can pass it as string
});

export default class AuthService {
    constructor() {
        this.log = new Logger('Auth');
    }

    authenticate() {
        return new Promise(function (resolve, reject) {
            var  exec = childProcess.exec;
            var browser = exec(`open -a "Google Chrome" "${ url }"`, function(err, stdout, stderr) {
                if (err) throw err;
            });

            eventEmitter.on('login', userLoggedIn);

            function userLoggedIn() {
                eventEmitter.removeListener('login', userLoggedIn);
                resolve();
            }
        });
    }

    setCredentials(credentials) {
        if (!credentials.refresh_token) {
            this.log.warn([
                "No refresh token detected.",
                "To generate another go to",
                "https://security.google.com/settings/security/permissions",
                ", and revoke access to your app."
            ].join(" "));
        }
        oauth2Client.setCredentials(credentials);
        google.options({ auth: oauth2Client });
    }

    getToken(code) {
        var self = this;
        var credentials;

        return getTokenFromGoogle(code)
        .then(function (response) {
            credentials = response;
            return db.getItem(DB_AUTH_KEY)
        })
        .then(function (dbCreds) {
            dbCreds = dbCreds || {};
            credentials = _.assign(dbCreds, credentials);
            return db.setItem(DB_AUTH_KEY, credentials);
        })
        .then(function () {
            self.setCredentials(credentials);
            eventEmitter.emit('login');
            return credentials;
        });
    }
}

function getTokenFromGoogle(code) {
    return new Promise(function (resolve, reject) {
        oauth2Client.getToken(code, function (err, response) {
            if (err) {
                reject(err);
            }
            resolve(response);
        })
    })
}
