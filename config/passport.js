// load the auth variables
var config = require('./index');

var SamlStrategy = require('passport-saml').Strategy;
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy.Strategy;

module.exports = function(passport) {

    /*
    findByEmail(profile.email, function(err, profile){
        if(err) return done(err);
        return done(null, profile);
    });
    */

    var saml = new SamlStrategy(config.auth.cern,
        function(profile, done){
            console.log('Profile: %j', profile);
            return done(null, profile);
        }
    );

    var oauth2 = new OAuth2Strategy(config.auth.oauth2,
        function(accessToken, refreshToken, profile, done){
            console.log('Profile: %j', profile);
            return done(null, profile);
        }
    );

    passport.use(saml);
    passport.use(oauth2);

    passport.serializeUser(function(profile, done){
        done(null, profile);
    });

    passport.deserializeUser(function(profile, done){
        done(null, profile);
    });

    return {saml: saml, oauth2: oauth2};
};
