// load the auth variables
var config = require('../config');

var OAuth2Strategy = require('passport-oauth').OAuth2Strategy.Strategy;

module.exports = function(passport) {

    var oauth2 = new OAuth2Strategy(config.auth.cern,
        function(accessToken, refreshToken, profile, done){
            console.log('Profile: %j', profile);
            return done(null, profile);
        }
    );

    passport.use(oauth2);

    passport.serializeUser(function(profile, done){
        done(null, profile);
    });

    passport.deserializeUser(function(profile, done){
        done(null, profile);
    });

};
