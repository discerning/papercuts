var express = require('express');
var passport = require('passport');
var router = express.Router();

// server-level access to firebase
var firebaseAuth = require('../services/firebase');

/* Authentication Sessions */

// route middleware to make sure a user is logged in
var isLoggedIn = function (req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};

router.get('/auth/oauth2',
    passport.authenticate('oauth2', {scope: 'bio'})
);

router.get('/auth/oauth2/callback',
    passport.authenticate('oauth2', {
        successRedirect: '/',
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

router.get('/analyses', function(req, res, next) {
    // list the analyses
    firebaseAuth({uid: 'papercuts'}).child('analyses').orderByKey().once("value", function(snapshot){
        var analyses = []
        if(snapshot.exists()){
            snapshot.forEach(function(snapshotChild){
                console.log(snapshotChild.key());
                analyses.push(snapshotChild.key());
            });
        }
        res.render('analyses', {analyses: analyses});

    });
});

router.get('/analysis/:analysis', function(req, res, next) {
    var analysis = req.params.analysis;
    firebaseAuth({uid: 'papercuts'}).child('analyses/'+analysis).once("value", function(snapshot){
        if(!snapshot.exists()){
            res.status(400);
            return next(new Error('An analysis by that name does not exist!'));
        }
    });
});

router.get('/analysis/:analysis/create', function(req, res, next) {
    var analysis = req.params.analysis;
    firebaseAuth({uid: 'papercuts'}).child('analyses/'+analysis).once("value", function(snapshot){
        if(snapshot.exists()){
            res.status(400);
            return next(new Error('An analysis by that name already exists!'));
        }
    });
});

module.exports = router;
