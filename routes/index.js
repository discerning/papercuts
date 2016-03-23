var express = require('express');
var passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy;
var router = express.Router();

/* Authentication Sessions */

// route middleware to make sure a user is logged in
var isLoggedIn = function (req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};

router.get('/auth/cern',
    passport.authenticate('saml')
);

router.get('/auth/cern/callback',
    passport.authenticate('saml', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
);

router.get('/auth/cern/metadata.xml', function(req, res){
    res.type('application/xml');
    res.send(200, SamlStrategy.generateServiceProviderMetadata());
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'papercuts' });
});

router.get('/home', isLoggedIn, function(req, res, next) {
    res.render('home', {});
});

module.exports = router;
