// load the auth variables
var config = require('../config');

var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');

var ref = new Firebase(config.services.firebase.url);
var tokenGenerator = new FirebaseTokenGenerator(config.services.firebase.secret);

// data on the inside for authentication
module.exports = function(data){
    ref.authWithCustomToken(tokenGenerator.createToken(data), function(err, authData){
        if(err){
            console.log("Login Failed!", err);
            return false;
        } else {
            console.log("Login Succeeded!", authData);
            return ref;
        }
    });
};
