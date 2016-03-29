// load the auth variables
var config = require('../config');

var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');

var tokenGenerator = new FirebaseTokenGenerator(config.services.firebase.secret);

// data on the inside for authentication
module.exports = function(data){
    var ref = new Firebase(config.services.firebase.url);
    ref.authWithCustomToken(tokenGenerator.createToken(data));
    return ref;
};
