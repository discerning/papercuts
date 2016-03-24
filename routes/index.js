var express = require('express');
var passport = require('passport');
var router = express.Router();

/* Authentication Sessions */

// route middleware to make sure a user is logged in
var isLoggedIn = function (req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};

router.get('/auth/oauth2',
    passport.authenticate('oauth2')
);

router.get('/auth/oauth2/callback',
    passport.authenticate('oauth2', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
);

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

router.get('/analyses/:analysis?', function(req, res, next) {
    var analysis = req.params.analysis;
    if(!analysis){
        // list the analyses
        res.render('analyses', {});
    } else {
        // get a specific analysis
        res.render('analysis', {});
    }
});

module.exports = router;
