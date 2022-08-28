const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shrineSchema = new Schema ({
	hash: String,
    journeyID: String
});

module.exports = mongoose.model('Shrine', shrineSchema);