const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./mongooseClient');
//require('dotenv/config');

//ejs
app.set('view engine', 'ejs'); //for optional frontend later on if necessary

//import routes
const databaseLogin = require('./routes/login'); //gets auth token after successful validation
const testTokenAuth = require('./routes/testAuth');
const databaseSeekerState = require('./routes/seeker_state'); //sync up user progress in journeys, return encapsulated data at updated state
const databaseSeekerRequestSaga = require('./routes/seeker_new'); //seeker starts new saga, return encapsulated data at starting state
const databaseSeekerShrineFound = require('./routes/seeker_shrine'); //update seeker progress in journey, no reply
const databaseCuratorNewSaga = require('./routes/curator_new'); //new saga
const databaseCuratorEditSaga = require('./routes/curator_edit'); //edit saga
const databaseCuratorDeleteSaga = require('./routes/curator_delete'); //delete saga
const { MongoBulkWriteError, MongoClient } = require('mongodb');
const req = require('express/lib/request');



//Turn the connection to the database ON and check for errors!
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
 
});

//check after disconnecting
/**
db.close();
db.once("close", function () {
    console.log("Disconnected successfully");

});
*/

//default route
app.get('/', (req, res) => {
  res.render('index');
});

//middlewares
app.use(bodyParser.json());
app.use(cors());

//links ./routes/database_edit to the route
app.use('/login', databaseLogin);
app.use('/testAuth', testTokenAuth); 
//app.use('/seeker-state', databaseSeekerState);
app.use('/seeker-new', databaseSeekerRequestSaga);
app.use('/seeker-shrine', databaseSeekerShrineFound);
app.use('/curator-new', databaseCuratorNewSaga);
//app.use('/curator-edit', databaseCuratorEditSaga);
app.use('/curator-delete', databaseCuratorDeleteSaga);

//listen
app.listen('3000');
