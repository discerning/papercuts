module.exports = {
    cern: {
        authorizationURL: 'https://oauth.web.cern.ch/OAuth/Authorize',
        tokenURL: 'https://oauth.web.cern.ch/OAuth/Token',
        infoURL: 'https://oauthresource.web.cern.ch/api/Me',
        clientID: 'papercuts',
        clientSecret: (typeof process.env.OAUTH2_SECRET === 'undefined') ? 'secret' : process.env.OAUTH2_SECRET,
        callbackURL: '/auth/oauth2/callback'
    },
    express_session: {
        secret: (typeof process.env.EXPRESSSESSION_SECRET === 'undefined') ? 'secret' : process.env.EXPRESSSESSION_SECRET
    },
    firebase: {
        url: 'https://papercuts.firebaseio.com/',
        secret: (typeof process.env.FIREBASE_SECRET === 'undefined') ? 'secret' : process.env.FIREBASE_SECRET
    },
    ssl: {
        enabled: (typeof process.env.PAPERCUTS_SSL === 'undefined' || process.env.PAPERCUTS_SSL !== 'true') ? false : true,
        port: 443
    }
};
