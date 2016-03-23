// load the auth variables
var config = require('./index');

var SamlStrategy = require('passport-saml').Strategy;

module.exports = function(passport) {

    var saml = new SamlStrategy(
        {
            path: config.auth.cern.path,
            entryPoint: config.auth.cern.entryPoint,
            issuer: config.auth.cern.issuer,
            host: config.auth.cern.host,
            protocol: config.auth.cern.protocol
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
        }
    );

    passport.use(saml);

    passport.serializeUser(function(user, done){
        done(null, user);
    });

    passport.deserializeUser(function(user, done){
        done(null, user);
    });

    return saml;
};
