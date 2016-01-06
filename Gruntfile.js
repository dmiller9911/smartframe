module.exports = function(grunt) {

    grunt.initConfig({});
    grunt.registerTask('setup', "configures users google settings", function () {
        var Promise = require('bluebird');
        var prompt = require('prompt');
        var fs = Promise.promisifyAll(require('fs'));

        var getPromptsAsync = Promise.promisify(prompt.get);
        var GOOGLE_CONGIG_PATH = process.cwd() + '/app/config/google.config.js';
        var SLIDESHOW_CONFIG_PATH = process.cwd() + '/app/config/slideshow.config.js';


        var done = this.async();

        var google = {
            properties: {
                client_id: {
                    required: true
                },
                client_secret: {
                    required: true
                },
                folderId: {
                    required: true
                }
            }
        };

        var slideshow = {
            properties: {
                dir: {
                    description: "Directory to serve pictures from relative to this base dir",
                    required: true,
                    type: "string",
                    default: '/pictures'
                },
                rotateSeconds: {
                    description: "Delay for Switching Pictures in (seconds)",
                    required: true,
                    type: 'number',
                    default: 5
                },
                refreshSeconds: {
                    description: "Delay for checking the directory for new pictures (seconds).",
                    required: true,
                    type: 'number',
                    default: 180
                },
                fetchMinutes: {
                    description: "Delay for checking for new pictures in the Drive Folder (minutes)",
                    required: true,
                    type: 'number',
                    default: 60
                },

            }
        };
        var currentGoogleConfig = getCurrentConfig(GOOGLE_CONGIG_PATH);
        if (currentGoogleConfig) {
            setGoogleDefaults(currentGoogleConfig);
        }

        var currentSlideShowConfig = getCurrentConfig(SLIDESHOW_CONFIG_PATH);
        if (currentSlideShowConfig) {
            setSlideshowDefaults(currentSlideShowConfig);
        }

        getPromptsAsync(google)
            .then(function (result) {
                return saveValues(GOOGLE_CONGIG_PATH, result);
            })
            .then(function () {
                return getPromptsAsync(slideshow)
            })
            .then(function (result) {
                return saveValues(SLIDESHOW_CONFIG_PATH, result);
            })
            .then(function () {
                done();
            });

        function setSlideshowDefaults(config) {
            slideshow.properties.rotateSeconds.default = config.client_id;
            slideshow.properties.refreshSeconds.default = config.client_secret;
            slideshow.properties.fetchMinutes.default = config.folderId;
            slideshow.properties.dir.default = config.folderId;
        }

        function setGoogleDefaults(config) {
            google.properties.client_id.default = config.client_id;
            google.properties.client_secret.default = config.client_secret;
            google.properties.folderId.default = config.folderId;
        }

        function saveValues(path, values) {
            var file = [
                "module.exports = ",
                JSON.stringify(values, undefined, 2),
                ';'
            ].join('');
            return fs.writeFileAsync(path, file);
        }

        function getCurrentConfig(path) {
            try {
                var config = require(path);
                return config;
            } catch(err) {
                return undefined;
            }
        }
    });

    grunt.registerTask('start', "Starts App", function () {
        var done = this.async();

        require('./app');
    });

    grunt.registerTask('default', 'start');
};



