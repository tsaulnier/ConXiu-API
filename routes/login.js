//important packages
const bcrypt = require('bcrypt');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require("../config/auth.config.js");
const auth = require("../middleware/authJwt");

const JWT_SECRET_KEY = config.secret;

//Create express service
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const User = require('../models/User');
const { resetWatchers } = require('nodemon/lib/monitor/watch');

function genAccessToken(user) {
    const token = jwt.sign({user_id: user._id},JWT_SECRET_KEY,
        {
          expiresIn: config.expiration,
        }
      );
      // save user token
      user.token = token;
    return token;
}

//test
router.get('/', async function(req, res){
    res.end('---ALIVE---');
});
  
        
// //get all users
// router.get("/users", async (request, response) => {
//     const users = await User.find({});
//     try {
//       response.send(users);
//     } catch (error) {
//       response.status(500).send(error);
//     }
// });

//Register
router.post('/register', async (request,response,next)=>{
    var post_data = request.body; 
    var newUser = new User({
        username: post_data.username,
        email: post_data.email,
        password: post_data.password,
        role: post_data.role,
        token: ""
    });

    //Check if email is already used.
    User.find({'email': newUser.email}).countDocuments(function(err,eNumber) {
        if(eNumber != 0) {
            response.json({success: false, msg:'Email already in use'});
        } else { // If email is good, check username next.
            //Checking if username is already used.
            User.find({'username': newUser.username}).countDocuments(function(err,uNumber) {
                if(uNumber != 0) {
                    response.json({success: false, msg:'Username already in use'});
                } else {
                    //Insert data if both email and username are not in use.
                    User.addUser(newUser,(err, User) => {
                        if(err) {
                            response.json({success: false, msg:'Failed to register user'})
                        } else {
                            response.json({success: true, msg:'User registered'});
                        }
                    });
                }
            })
        }
    })
});
        
// Login
router.post('/login',(request,response) => {
            
    var post_data = request.body;
    var username = post_data.username;
    var userPassword = post_data.password;
          
    //Check for username
    User.find({'username':username}).countDocuments(function(err,number) {
            if(number == 0) {
                response.json({success: false, msg:'Wrong username or password'});
            } else {
                //Insert data
                User.findOne({'username':username},function(err,user) {
                        var hashed_password = user.password;
                        bcrypt.compare(userPassword, hashed_password, 
                            async function (err, isMatch) { 
                            if (isMatch) {
                                user.token = genAccessToken(user);
                                user.save();
                                response.json({success: true, msg:'Login in success',token: user.token});
                            } else if (!isMatch) {
                                response.json({success: false, msg:'Wrong username or password'});
                            }
                        })
                    })
            } 
    })
});

// Edit user data
router.post('/editUser', auth, async function(req, res) {
    var curUsername;
    var newHashPass;
    User.findOne({'_id':req.user.user_id},function(err,user) {
        curUsername = user.username;
    });
    User.find({'username': req.body.newUsername}).countDocuments(function(err,uNumber) {
        if(uNumber != 0) {
            res.json({success: false, msg:'Username already in use'});
        } else {
            User.findOne({'username':curUsername},function(err,user) {
                bcrypt.compare(req.body.curPassword, user.password, async function (err, isMatch) { 
                    if (isMatch) {
                        bcrypt.genSalt(10,(err,salt) => {
                            bcrypt.hash(req.body.newPassword, salt , (err, hash) => {
                                if(err) console.log(err);

                                user.password = hash;
                                user.save()
                            });
                        });
                        user.username = req.body.newUsername;
                        user.save();
                        res.json({success: true, msg:'Credentials changed'});
                    } else if (!isMatch) {
                        res.json({success: false, msg:'Wrong username or password'});
                    }
                })
            })
        } 
    })
});

// Edit user data
router.post('/userVerify', auth, async function(req, res) {
    res.json({success: true, msg:'User token valid'});
});

module.exports = router;
