const express = require('express')

const app = express()
app.use(express.json());
const ObjectId = require("mongodb").ObjectId;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// connect to MongoDB
const MongoClient = require("mongodb").MongoClient;

let db;
MongoClient.connect('mongodb+srv://tiwwzy:worldbest@cluster0.qoocm.mongodb.net/classwork?retryWrites=true&w=majority'
, (err, client) => {
db = client.db('classwork')
})

// get the collection name
app.param("collectionName", (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  // console.log('collection name:', req.collection)
  return next();
});

// dispaly a message for root path to show that API is working
app.get("/", function (req, res) {
  res.send("Welcome to the root path \n Select a collection, e.g., /collection/messages");
});

// retrieve all the objects from an collection
app.get("/collection/:collectionName", (req, res) => {
  req.collection.find({}).toArray((e, results) => {
    if (e) return next(e);
    res.send(results);
  });
});


//add an object
app.post("/collection/:collectionName", (req, res, next) => {
  req.collection.insert(req.body, (err, results) => {
    if (err) return next(err);
    res.send(results.ops);
  });
});

// update an object by ID
app.put("/collection/:collectionName/:id", (req, res, next) => {
  req.collection.update(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body },
    { safe: true, multi: false },
    (e, result) => {
      if (e) return next(e);
      res.send(result.result.n === 1 ? { msg: "success" } : { msg: "error" });
    }
  );
});


const port = process.env.PORT || 4000;

app.listen(port);
console.log("Running on 3k" & port);