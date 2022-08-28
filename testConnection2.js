

const MongoClient = require('mongodb').MongoClient;

// Connect URL
 const url = 'mongodb://127.0.0.1:27017';

 // Connec to MongoDB
  MongoClient.connect(url, {
     useNewUrlParser: true,
         useUnifiedTopology: true
         }, (err, client) => {
             if (err) {
                     return console.log(err);
                         }

                             // Specify database you want to access
                                 const db = client.db('conxiu');

                                     console.log(`MongoDB Connected: ${url}`, `\n---------Database connection Etablished with : ${db.databaseName}--------`);
		 		 client.close();
                                     });
