import BPromise from 'bluebird';
import fs from 'fs';
import path from 'path';


const DB_FILE = path.join(process.cwd(), 'app/db/db.json');

class DataStore {
    constructor() {

    }

    setItem(key, value) {
        return fs.readFileAsync(DB_FILE, 'utf8')
            .then((data) => {
                let db = JSON.parse(data);
                db[key] = value;
                return fs.writeFileAsync(DB_FILE, JSON.stringify(db, undefined, 2));
            })
            .catch((err) => {
                if (err.code === "ENOENT") {
                    return fs.writeFileAsync(DB_FILE, JSON.stringify({}, undefined, 2))
                        .then(() => {
                            return this.setItem(key, value);
                        });
                }
            });
    }

    getItem(key) {
        var self = this;
        return fs.readFileAsync(DB_FILE, 'utf8')
            .then(function (data) {
                let db = JSON.parse(data);
                return db[key]
            })
            .catch((err) => {
                if (err.code === "ENOENT") {
                    return fs.writeFileAsync(DB_FILE, JSON.stringify({}, undefined, 2))
                        .then(() => {
                            return this.setItem(key, value);
                        });
                }
            });
    }
}

const db = new DataStore();

export default db;
