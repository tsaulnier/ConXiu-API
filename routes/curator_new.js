const express = require('express');
const router = express.Router();

const auth = require("../middleware/authJwt");

const User = require('../models/User');

const Saga = require('../models/Saga');
const Journey = require('../models/Journey');
const Shrine = require('../models/Shrine');
const { response } = require('express');

//
const bodyParser = require('body-parser');

router.post('/newSaga', auth, (req, res) => {
    try {
        var newSaga = new Saga ({
            name: req.body.saga.name,
            description: req.body.saga.description,
            authorID: req.user.user_id,
        });
        newSaga.save();
        User.findOne({'_id':req.user.user_id},function(err,user) {
            var strID = JSON.stringify(newSaga._id).match(/\"(.*?)\"/)[1];
            user.curatedSagaIDs.push(strID);
            user.save();
        })
        res.json({success: true, msg:'Saga Created', id: newSaga._id});
    } catch (err) {
        console.log(err);
        res.json({success: false, msg:'Failed to create journey'})
    }
});

router.post('/newJourney', auth, (req, res) => {
    try {
        var newJourney = new Journey (req.body.journey);
        newJourney.save();
        Saga.findOne({'_id':newJourney.sagaID},function(err,saga) {
            var strID = JSON.stringify(newJourney._id).match(/\"(.*?)\"/)[1];
            saga.journeyIDs.push(strID);
            saga.save();
        })
        res.json({success: true, msg:'Journey Created', id: newJourney._id});
    } catch (err) {
        res.json({success: false, msg:'Failed to create journey'})
    }
});

router.post('/newShrine', auth, (req, res) => {
    try {
        var newShrine = new Shrine(req.body.shrine);
        newShrine.save();
        Journey.findOne({'_id':newShrine.journeyID},function(err,journey) {
            var strID = JSON.stringify(newShrine._id).match(/\"(.*?)\"/)[1];
            journey.shrineIDs.push(strID);
            journey.save();
        })
        res.json({success: true, msg:'Shrine Created', id: newShrine._id});
    } catch (err) {
        res.json({success: false, msg:'Failed to create shrine'})
    }
});
  
module.exports = router;
