var express = require('express');
var router = express.Router();

var firebase = require('../services/firebase');
var schema = require('../config/schema');

var json_validator = require('jsonschema').validate;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/analysis/:analysis', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var analysis = req.params.analysis;
    var token = req.query.token;

    // first: ensure that there is a valid analysis by that name
    firebase.child(analysis).once("value", function(snapshot){
        if(!snapshot.exists()){
            res.status(400);
            res.send(JSON.stringify({analysis: analysis, message: 'An analysis by that name does not exist!', error: true, errors: []}));
            return;
        }
        // next: ensure that they have the right secret to post shit
        if(snapshot.child('secret').val() != req.query.token){
            res.status(401);
            res.send(JSON.stringify({analysis: analysis, message: 'Authentication failed. Is the token correct?', error: true, errors: []}));
            return;
        }
        // next: check that the json passes the schema
        var json_check = json_validator(req.body, schema.cutflow);
        if(!json_check.valid){
            res.status(400);
            res.send(JSON.stringify({analysis: analysis, message: 'JSON is not valid for the cutflow schema.', error: true, errors: json_check.errors}));
            return;
        }
        // i guess everything checks out
        res.send(JSON.stringify({analysis: analysis, error: false, errors: []}));
    });
});


module.exports = router;
