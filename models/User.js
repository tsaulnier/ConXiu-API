const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { TokenExpiredError } = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const userSchema = new Schema({
	username: String,
	email: String,
	password: String,
    role: String,
    token: String,
    curatedSagaIDs: [String],
    games: [{
        journeyID: String,
        shrineID: String
    }]
});

module.exports = mongoose.model('User', userSchema);

module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(newUser.password, salt , (err, hash) => {
         if(err) throw (err);
 
         newUser.password=hash;
         newUser.save(callback);
        });
    });
}