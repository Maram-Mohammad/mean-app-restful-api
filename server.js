var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");

var ObjectID = mongodb.ObjectID;
var CONTACTS_COLLECTION = "contacts";


var app = express();
app.use(bodyParser.json());
var db;


// SET MONGOLAB_URI="mongodb://maram:123456@ds137464.mlab.com:37464/contactlist"
var url = process.env.MONGOLAB_URI;
let uri="mongodb://maram:123456@ds137464.mlab.com:37464/contactlist";


mongodb.MongoClient.connect(process.env.MONGODB_URI||uri, function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  db = client.db('contactlist');
  console.log("Database connection ready");

  var server = app.listen(8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});



function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/api/contacts", function(req, res) {
  db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err,docs){
    if(err){
      handleError(res,err.message,"failed to get Contacts.");
    } else {
        res.status(200).json(docs)
    }
  })
});

app.post("/api/contacts", function(req, res) {
  var newContact = req.body;
  if(!req.body.name){
    handleError(res,"Invalid user Input","Must Provide a name", 400);
  }
  db.collection(CONTACTS_COLLECTION).insertOne(newContact,function(err,docs){
    if(err){
      handleError(res,err.message,"Failed to create new contact");
    }else{
      res.status(201).json(docs.ops[0]);
    }
  })
});

app.get("/api/contacts/:id", function(req, res) {
});

app.put("/api/contacts/:id", function(req, res) {
});

app.delete("/api/contacts/:id", function(req, res) {
});
