var express = require('express');
var router = express.Router();

var firebase = require('../services/firebase');
var schema = require('../config/schema');

var json_validator = require('jsonschema').validate;

router.post('/analysis/:analysis', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var analysis = req.params.analysis;
    var token = req.query.token;

    // Please remember the nesting is because of asynchronous callbacks with Firebase
    // first: ensure that there is a valid analysis by that name
    firebase.child('analyses/' + analysis).once("value", function(snapshot){
        if(!snapshot.exists()){
            res.status(400);
            res.send(JSON.stringify({
                analysis: analysis,
                error: true,
                message: 'An analysis by that name does not exist!',
                results: []
            }));
            return;
        }
        // next: ensure that they have the right secret to post shit
        firebase.child('secrets/' + analysis).once("value", function(snapshot){
            if(snapshot.val() != req.query.token){
                res.status(401);
                res.send(JSON.stringify({
                    analysis: analysis,
                    error: true,
                    message: 'Authentication failed. Is the token correct?',
                    results: []
                }));
                return;
            }
            // next: check that the json passes the schema
            var json_check = json_validator(req.body, schema.cutflow);
            if(!json_check.valid){
                res.status(400);
                res.send(JSON.stringify({
                    analysis: analysis,
                    error: true,
                    message: 'JSON is not valid for the cutflow schema.',
                    results: json_check.errors
                }));
                return;
            }
            // next: the schema doesn't handle the edge case where a cutflow name
            // is duplicated with different values
            /*
                [
                    {"duplicate_event": 200000},
                    {"jet_multiplicity": 150000},
                    {"duplicate_event": 210000}
                ]
            */
            var cutflowNames = [];
            for(var i = 0; i < req.body.length; i++){
                var cutflowName = Object.keys(req.body[i])[0];
                if(cutflowNames.indexOf(cutflowName) > -1){
                    // we've seen this cutflow before!
                    res.status(400);
                    res.send(JSON.stringify({
                        analysis: analysis,
                        error: true,
                        message: 'Duplicate cutflow name provided.',
                        results: [cutflowName]
                    }));
                    return;
                }
                cutflowNames.push(cutflowName);
            }
            // i guess everything checks out - push the new cutflow to the cutflows/<analysis> bucket
            var newCutflowRef = firebase.child('cutflows/'+analysis).push(req.body);
            res.send(JSON.stringify({
                analysis: analysis,
                error: false,
                message: 'Pushed the new cutflow! Thanks for using us.',
                results: [newCutflowRef.key()]
            }));
            return;
        });
    });
});


module.exports = router;
