module.exports = {
    cern: {
        authorizationURL: 'https://oauth.web.cern.ch/OAuth/Authorize',
        tokenURL: 'https://oauth.web.cern.ch/OAuth/Token',
        clientID: 'papercuts',
        clientSecret: (typeof process.env.OAUTH2_SECRET === 'undefined') ? 'secret' : process.env.OAUTH2_SECRET,
        callbackURL: '/auth/oauth2/callback'
    }
};
