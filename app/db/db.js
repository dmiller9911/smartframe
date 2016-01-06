import BPromise from 'bluebird';
import fs from 'fs';



const DB_FILE = 'app/db/db.json';

class DataStore {
    constructor() {

    }

    setItem(key, value) {
        var self = this;
        return fs.readFileAsync(DB_FILE, 'utf8')
            .then(function (data) {
                var db = JSON.parse(data);
                db[key] = value;
                return fs.writeFileAsync(DB_FILE, JSON.stringify(db, undefined, 2));
            })
            .catch(function (err) {
                if (err.code === "ENOENT") {
                    return fs.writeFileAsync(DB_FILE, JSON.stringify({}, undefined, 2))
                        .then(function () {
                            return self.setItem(key, value);
                        });
                }
            })
    }

    getItem(key) {
        var self = this;
        return fs.readFileAsync(DB_FILE, 'utf8')
            .then(function (data) {
                var db = JSON.parse(data);
                return db[key]
            })
            .catch(function (err) {
                if (err.code === "ENOENT") {
                    return fs.writeFileAsync(DB_FILE, JSON.stringify({}, undefined, 2))
                        .then(function () {
                            return self.getItem(key);
                        });
                }
            });
    }
}

var db = new DataStore();

export default db;
