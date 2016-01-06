
export default (function () {
    try {
        var userGoogle = require('./google.config');
    } catch(err) {
        throw new Error("User Settings Not Found. You Must Run: \"grunt setup\" to configure google provider settings");
    }

    try {
        var slideshow = require('./slideshow.config');
    } catch(err) {
        throw new Error("User Settings Not Found. You Must Run: \"grunt setup\" to configure slideshow settings");
    }

    var config = {
        logLevel: "debug",
        port: 3000,
        slideshowdir: '/pictures',
        dbKeys: {
            pictures: "pictures",
            auth: "auth"
        },
        baseGoogle: {},
        google: {
            access_type: "offline",
            authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
            baseUrl: "https://www.googleapis.com/",
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:3000/auth/callback",
            response_type: "code",
            scopes: [
                "profile",
                "email",
                "https://www.googleapis.com/auth/drive.readonly"
            ]
        },
        userGoogle: userGoogle,
        slideshow: slideshow
    };
    return config;
})();
