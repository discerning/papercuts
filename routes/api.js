var express = require('express');
var router = express.Router();

var firebase = require('../services/firebase');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/analysis/:analysis', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var analysis = req.params.analysis;
    var token = req.query.token;

    // first ensure that there is a valid analysis
    firebase.child(analysis).once("value", function(snapshot){
        if(!snapshot.exists()){
            res.status(400);
            res.send(JSON.stringify({analysis: analysis, error: 'An analysis by that name does not exist!'}));
            return;
        } else {
            // next ensure that they have the right secret to post shit
            if(snapshot.child('secret').val() != req.query.token){
                res.status(401);
                res.send(JSON.stringify({analysis: analysis, error: 'Authentication failed. Is the token correct?'}));
                return;
            } else {
                // i guess everything is ok
                res.send(JSON.stringify({analysis: analysis, error: null}));
            }
        }
    });
});


module.exports = router;
