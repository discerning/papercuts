// load the auth variables
var config = require('../config');

var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');

var ref = Firebase(config.services.firebase.url);
var tokenGenerator = new FirebaseTokenGenerator(config.services.firebase.secret);

ref.authWithCustomToken(tokenGenerator.createToken(),
    function(err, authData){
        if(err){
            console.log("Login Failed!", err);
        } else {
            console.log("Login Succeeded!", authData);
        }
    });

module.exports = ref;
