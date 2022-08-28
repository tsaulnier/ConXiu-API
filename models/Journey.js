const { BSONType } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journeySchema = new Schema ({
	name: String,
    description: String,
    sagaID: String,
    shrineIDs: [String],
    byteDataBuf: [Buffer],
    downloadable: Boolean
});

module.exports = mongoose.model('Journey', journeySchema);