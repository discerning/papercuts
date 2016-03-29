var config = require('../config');

var express = require('express');
var passport = require('passport');
var router = express.Router();

// server-level access to firebase
var firebaseAuth = require('../services/firebase');
var Firebase = require('firebase');

// secret generation
var md5 = require('md5');

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

router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'papercuts' });
});

router.get('/me', isLoggedIn, function(req, res, next) {
    res.render('me');
});

router.get('/analyses', isLoggedIn, function(req, res, next) {
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

router.get('/analysis/:analysis', isLoggedIn, function(req, res, next) {
    var analysis = req.params.analysis;
    firebaseAuth({uid: 'papercuts'}).child('analyses/'+analysis).once("value", function(snapshot){
        var data = {};
        data['analysis'] = analysis;
        data['exists'] = snapshot.exists();
        if(data['exists']){
            var snapData = snapshot.val();
            data['owner'] = snapData.owner;
            data['timestamp'] = snapData.timestamp;
            firebaseAuth({uid: 'papercuts'}).child('cutflows/'+analysis).once("value", function(snapshot){
                data['num_cutflows'] = snapshot.numChildren();
                res.render('analysis', data);
            });
        } else {
            res.render('analysis', data);
        }
    });
});

router.get('/analysis/:analysis/create', isLoggedIn, function(req, res, next) {
    var analysis = req.params.analysis;
    firebaseAuth({uid: 'papercuts'}).child('analyses/'+analysis).once("value", function(snapshot){
        if(snapshot.exists()){
            res.status(400);
            return next(new Error('An analysis by that name already exists!'));
        } else {
            var client_secret = md5(analysis+config.services.firebase.secret);
            var updatedData = {};
            updatedData["analyses/"+analysis] = {owner: req.user.PersonID, timestamp: Firebase.ServerValue.TIMESTAMP};
            updatedData["client_secrets/"+analysis] = client_secret;
            firebaseAuth({uid: 'papercuts'}).update(updatedData).then(function(){
                res.render('analysis_created', {analysis: analysis, owner: req.user.PersonID, client_secret: client_secret});
            }).catch(function(err){
                res.status(500);
                return next(err);
            });
        }
    });
});

module.exports = router;
