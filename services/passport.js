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
                    var userInfo = JSON.parse(body);
                    console.log('User Info: %j', userInfo);

                    // let's build this mofo up
                    var profile = {};
                    for(var i in userInfo){
                        var info = userInfo[i];
                        // extract key and value
                        var key = info.Type.split('claims/').pop();
                        var val = info.Value;
                        if(!(key in profile)){
                            profile[key] = val;
                        } else {
                            // already exists

                            // is it an array of values yet?
                            if(profile[key].constructor === Array){
                                profile[key].push(val);
                            } else {
                                // make it an array
                                profile[key] = [profile[key], val];
                            }
                        }
                    }
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
