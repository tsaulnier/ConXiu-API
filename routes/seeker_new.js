//important packages
var bcrypt = require('bcrypt');
var express = require('express');
var bodyParser = require('body-parser');
const router = express.Router();

const User = require('../models/User');

const { request } = require('express');
const auth = require("../middleware/authJwt");
const Shrine = require('../models/Shrine');
const Saga = require('../models/Saga');
const Journey = require('../models/Journey');

//Create express service
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//test
router.post('/', async function(req, res){
  res.end('---ALIVE---');

});

//CRUD Operations

//get all users
router.post("/users", async (request, response) => {
  const users = await User.find({});

  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});



//Post user data
router.post('/addUser', async function(req, res){
  const user = new User(req.body);

  try {
      await user.save();
      res.status(200).json({"success": true, "message":"User details saved"});

  } catch (err) {
      res.status(400).json({"success": false, "message":"Error in saving user details"});
  }

});

/**

// Gets the cordinates from a given shrineID
router.get('/getShrineCords', auth, async function(req, res) {
  const shrineID = req.body.shrineID;
  Shrine.findOne({"_id":shrineID}, function(err, shrine) {
    if(!err) {
      res.json({success: true, msg:'Shrine found, returning cords.', long: shrine.coordinates.longitude, lat: shrine.coordinates.latitude});
    } else {
      res.json({success: false, msg:'Shrine not found'});
    }
  });
});

**/

/**

// Gets the prompt (meditation) from a given shrineID
router.get('/getMeditation', auth, async function(req, res) {
  const shrineID = req.body.shrineID;
  Shrine.findOne({"_id":shrineID}, function(err, shrine) {
    if(!err) {
      res.json({success: true, msg:'Shrine found, returning prompt.', prompt: shrine.prompt});
    } else {
      res.json({success: false, msg:'Shrine not found'});
    }
  });
});

**/

// Get all sagas stored in DB
router.post('/getSagas', auth, async function(req, res) {
  var sagaArray = [];
  Saga.find({}, (err, sagas) => {
    if(err) {
      res.json({success: false, msg: "Error while finding Sagas."});
    } else {
      sagas.map(saga => {
        var sagaData = {};
        sagaData.id = saga._id;
        sagaData.name = saga.name;
        sagaData.authorID = saga.authorID;
        sagaArray.push(sagaData);
      })
      res.json({success: true, sagaArray});
    }
  });
});

// Get all Journeys within a given Saga passed via it's ID
router.post('/getJourneys', auth, async function(req, res) {
  var journeyArray = [];
  var sagaName;

  Saga.findOne({"_id": req.body.sagaID},function(err,saga) { 
    if(err) {
      res.json({success: false, msg: err});
    } else {
      sagaName = saga.name;
      Journey.find({sagaID: req.body.sagaID}, (err, journeys) => {
        if(err) {
          res.json({success: false, msg: err});
        } else {
          journeys.map(journey => {
            var journeyData = {};
            journeyData.id = journey._id;
            journeyData.name = journey.name;
            journeyData.byteData = journey.byteDataBuf;
            journeyArray.push(journeyData);
          })
          res.json({success: true, parentName: sagaName, journeyArray});
        }
      });
    }
  });
});

// Get all Shrines within a given Journey passed via it's ID
router.post('/getShrines', auth, async function(req, res) {
  var shrineArray = [];
  var journeyName;

  Journey.findOne({"_id": req.body.journeyID},function(err,journey) {
    if(err) {
      res.json({success: false, msg: err});
    } else {
      journeyName = journey.name;
      Shrine.find({journeyID: req.body.journeyID}, (err, shrines) => {
        if(err) {
          res.json({success: false, msg: err});
        } else {
          shrines.map(shrine => {
            var shrineData = {};
            shrineData.id = shrine._id;
            shrineData.hash = shrine.hash;
            shrineArray.push(shrineData);
          })
          res.json({success: true, parentName: journeyName, shrineArray});
        }
      });
    }
  });
});


module.exports = router;
