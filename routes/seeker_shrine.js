//this is the route that keeps track of which shrine a seeker has reached within a journey
//it does this by updating the index for that particular journey in the Users document

const express = require('express');
const router = express.Router();

const User = require('../models/User');

const { request } = require('express');
const auth = require("../middleware/authJwt");
const Shrine = require('../models/Shrine');
const Saga = require('../models/Saga');
const Journey = require('../models/Journey');

// Updates the shrine at which a user is currently at within their game.
// Takes the ID of the Jounrey they are playing
// And the ShrineID they are currently on.
router.post('/updateGameData', auth, async function(req, res) {
    var curJourneyID = req.body.journeyID;
    var curShrineID = req.body.shrineID;

    User.findOne({'_id':req.user.user_id},function(err,user) {
        if(err) {
            res.json({success: false, msg:'Game progress failed to update.'});
        }
        var gameData = {};
        var gameExists = false;
        var index = 0;

        for (var i in user.games) {
            if(user.games[i].journeyID == curJourneyID){
                index = i;
                gameExists = true;
            }
        }
        if(gameExists) {
            user.games[index].shrineID = curShrineID;
        } else {
            gameData.journeyID = curJourneyID;
            gameData.shrineID = curShrineID;
            user.games.push(gameData);
        }
        user.save();
    });
    res.json({success: true, msg:'Game progress updated.'});
});

// Returns the ShrineID where a user left off in a game.
// Takes in the JounreyID of the game in reference.
router.get('/getGameData', auth, async function(req, res) {
    var curJourneyID = req.body.journeyID;
    var curShrineID;
    User.findOne({'_id':req.user.user_id},function(err,user) {
        if(err) {
            res.json({success: false, msg:'Failed to find game progress.'});
        }
        for (var i in user.games) {
            if(user.games[i].journeyID == curJourneyID){
                curShrineID = user.games[i].shrineID
            }
        }
        if(curShrineID != undefined){
            res.json({success: true, msg:'Fround existing game progress.', ShrineID: curShrineID});
        } else {
            res.json({success: false, msg:'Failed to find game progress.'});
        }
    });
});

module.exports = router;