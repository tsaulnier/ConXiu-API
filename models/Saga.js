const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sagaSchema = new Schema ({
	name: String,
    description: String,
    authorID: String,
    editors: [String],
    journeyIDs: [String]
});

module.exports = mongoose.model('Saga', sagaSchema);