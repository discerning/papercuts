var express = require('express');
var router = express.Router();

var firebaseAuth = require('../services/firebase');
var schema = require('../config/schema');

var json_validator = require('jsonschema').validate;

router.post('/analysis/:analysis', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var analysis = req.params.analysis;

    // check that the json passes the schema
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

    var firebase = firebaseAuth({uid: 'api', client_secret: req.query.token});

    // i guess everything checks out - push the new cutflow to the cutflows/<analysis> bucket
    firebase.child('cutflows/'+analysis).push(req.body).then(function(newRef){
        res.status(200);
        res.send(JSON.stringify({
            analysis: analysis,
            error: false,
            message: 'Pushed the new cutflow! Thanks for using us.',
            results: [newRef.key()]
        }));
        return;
    }).catch(function(err){
        res.status(500);
        res.send(JSON.stringify({
            analysis: analysis,
            error: true,
            message: err.message,
            results: [err]
        }));
        return;
    });
});


module.exports = router;
