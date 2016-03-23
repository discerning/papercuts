// load the auth variables
var config = require('./index');

var SamlStrategy = require('passport-saml').Strategy;

module.exports = function(passport) {

    passport.use(new SamlStrategy(
        {
            path: config.auth.cern.path,
            entryPoint: config.auth.cern.entryPoint,
            issuer: config.auth.cern.issuer
        },
        function(profile, done){
            /*
            findByEmail(profile.email, function(err, user){
                if(err) return done(err);
                return done(null, user);
            });
            */
            console.log('Profile: %j', profile);
            return done(null, user);
        })
    );

    passport.serializeUser(function(user, done){
        done(null, user);
    });

    passport.deserializeUser(function(user, done){
        done(null, user);
    });

};
