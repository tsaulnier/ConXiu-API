const mongoose = require('mongoose');
//const connectionString ="mongodb+srv://admin:adminFrenchfry@cluster0.l1r7g.mongodb.net/conxiu?retryWrites=true&w=majority";
const connectionString = "mongodb://localhost:27017";
mongoose.connect(connectionString,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));

