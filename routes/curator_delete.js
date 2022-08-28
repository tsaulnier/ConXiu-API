const express = require('express');
const router = express.Router();

const auth = require("../middleware/authJwt");

const User = require('../models/User');

const Saga = require('../models/Saga');
const Journey = require('../models/Journey');
const Shrine = require('../models/Shrine');
const { response } = require('express');

const bodyParser = require('body-parser');
const { mongo } = require('mongoose');
var ObjectId = require('mongodb').ObjectId;

// DELETE Shrine
router.post('/deleteShrine', auth, async function(req, res){
    Shrine.find({"_id": new mongo.ObjectId(req.body.id)}).countDocuments(function(err,eNumber) {
        if(eNumber != 0) {
            Shrine.findOne({"_id": new mongo.ObjectId(req.body.id)},function(err,shrine) {
                Journey.findOne({"_id": new mongo.ObjectId(shrine.journeyID)},function(err,journey) {
                    Saga.findOne({"_id": new mongo.ObjectId(journey.sagaID)},function(err,saga) {
                        if(saga.authorID == req.user.user_id) {
                            for (var i in journey.shrineIDs) {
                                var idDelete = journey.shrineIDs[i];
                                if(req.body.id == idDelete){
                                    delete journey.shrineIDs[i];
                                }
                            }
                            journey.save();
                            Shrine.deleteOne({"_id": new mongo.ObjectId(req.body.id)},function(err,shrine) {})
                            res.json({success: true, msg:'Shrine deleted'});
                        } else {
                            res.json({success: false, msg:'Don\'t have permission to delete Shrine'});
                        }
                    })
                })
            })
        } else {
            res.json({success: false, msg:'Shrine not found'});
        }
    }) 
});

// DELETE Journey
router.post('/deleteJourney', auth, async function(req, res){
    Journey.find({"_id": new mongo.ObjectId(req.body.id)}).countDocuments(function(err,eNumber) {
        if(eNumber != 0) {
            Journey.findOne({"_id": new mongo.ObjectId(req.body.id)},function(err,journey) { 
                Saga.findOne({"_id": new mongo.ObjectId(journey.sagaID)},function(err,saga) {
                    if(saga.authorID == req.user.user_id) {
                        for (var i in saga.journeyIDs) {
                            var idDelete = saga.journeyIDs[i];
                            if(req.body.id == idDelete){
                                delete journey.shrineIDs[i];
                            }
                        }
                    } else {
                        res.json({success: false, msg:'Don\'t have permission to delete Journey'});
                    }
                });
                for (var i in journey.shrineIDs) {
                    var idDelete = journey.shrineIDs[i];
                    Shrine.deleteOne({"_id": new mongo.ObjectId(idDelete)},function(err,shrineD) {})
                }
                Journey.deleteOne({"_id": new mongo.ObjectId(req.body.id)},function(err,journeyD) {})
            })
            res.json({success: true, msg:'Journey deleted'});
        } else {
            res.json({success: false, msg:'Journey not found'});
        }
    }) 
});

// DELETE Saga
router.post('/deleteSaga', auth, async function(req, res){
    Saga.find({"_id": new mongo.ObjectId(req.body.id)}).countDocuments(function(err,eNumber) {
        if(eNumber != 0) {
            Saga.findOne({"_id": new mongo.ObjectId(req.body.id)},function(err,saga) { 
                if(saga.authorID == req.user.user_id) {
                    for (var i in saga.journeyIDs) {
                        var idDeleteJ = saga.journeyIDs[i];
                        console.log(saga.journeyIDs[i]);
                        Journey.findOne({"_id": new mongo.ObjectId(idDeleteJ)},function(err,journeyD) {
                            for (var x in journeyD.shrineIDs) {
                                var idDeleteS = journeyD.shrineIDs[x];
                                Shrine.deleteOne({"_id": new mongo.ObjectId(idDeleteS)},function(err,shrineD) {})
                            }
                        })
                        Journey.deleteOne({"_id": new mongo.ObjectId(idDeleteJ)},function(err,journey) {})
                    }
                } else {
                    res.json({success: false, msg:'Don\'t have permission to delete Saga'});
                }
            })
            Saga.deleteOne({"_id": new mongo.ObjectId(req.body.id)},function(err,journeyD) {})
            res.json({success: true, msg:'Saga deleted'});
        } else {
            res.json({success: false, msg: 'Saga not found'});
        }
    }) 
});

module.exports = router;