const auth = require("../middleware/authJwt");
const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.post("/welcome", auth, (req, res) => {
    // userID is stored in req under user.user_id
    const userID = req.user.user_id
    User.findOne({'_id':userID},function(err,user) {
        var username = user.username;
        res.send("Welcome " + username);
    })
});

module.exports = router;