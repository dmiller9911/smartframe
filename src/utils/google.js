import google from 'googleapis';
import config from '../config';

const key = require(config.serviceKeyFilePath);
const drive = google.drive('v2');

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/drive.readonly'],
  null
);

export function authenticate() {
  return new Promise((resolve, reject) => {
    jwtClient.authorize((err, tokens) => {
      if (err) {
        return reject(err);
      }
      return resolve(tokens);
    });
  });
}

export function getChildren(folderId, maxResults = 1000) {
  return new Promise((resolve, reject) => {
    const req = {
      folderId: folderId,
      maxResults: maxResults,
      auth: jwtClient
    };
    drive.children.list(req, (err, response) => {
      if (err) {
        return reject(err);
      }
      return resolve(response);
    });
  });
}

export function getFile(fileId, retryCount = 0) {
  if (retryCount > 3) {
    return Promise.reject();
  }
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      drive.files.get({ fileId, auth: jwtClient }, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    }, (Math.floor(Math.random() * 1500) + 100));
  });

  return promise
    .catch((err) => {
      if (err.code === 403) {
        return getFile(fileId, retryCount + 1);
      }
      return Promise.reject(err);
    });
}
