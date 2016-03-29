// load the auth variables
var config = require('../config');

// get user info
var https = require('https');
var url = require('url');

var OAuth2Strategy = require('passport-oauth').OAuth2Strategy.Strategy;

module.exports = function(passport) {

    var oauth2 = new OAuth2Strategy(config.services.cern,
        function(accessToken, refreshToken, profile, done){
            var URI = url.parse(config.services.cern.infoURL);
            var user_req = https.request({
                host: URI.hostname,
                path: URI.pathname,
                port: URI.port,
                method: 'GET',
                headers: {
                    Authorization: "Bearer "+accessToken
                }
            }, function(res){
                var body = '';
                res.on('data', function(chunk){ body+= chunk; });
                res.on('end', function(){
                    var profile = JSON.parse(body);
                    console.log('Profile: %j', profile);
                    return done(null, profile);
                });
            }).on('error', function(e){
                console.log("Got an error: ", e);
                return done(e);
            }).end();
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
