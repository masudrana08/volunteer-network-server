const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


// var admin = require("firebase-admin");

// var serviceAccount = require("./volunteer-network-fullstack-firebase-adminsdk-q8i4w-73316a9b54.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://volunteer-network-fullstack.firebaseio.com"
// });



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fjsvr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db(`${process.env.DB_NAME}`).collection("events");
  const registeredEvents = client.db(`${process.env.DB_NAME}`).collection("registered");
  //mongo scope start

  app.get('/show-volunteers', (req,res)=>{
    eventsCollection.find({})
    .toArray((error, documents)=>{
      res.send(documents)
    })
  })

    app.post('/submit-form',(req,res)=>{
      registeredEvents.insertOne(req.body)
      .then(result=>{
        console.log(result)
        res.send(result.insertedCount>0)
      })
    })

    app.get('/my-events',(req,res)=>{
      registeredEvents.find({email:req.headers.email})
      .toArray((error,documents)=>{
        res.send(documents)
        
      })
    })
  //mongo scope end
});



const PORT = process.env.port || 3001
app.listen(PORT, ()=>{
    console.log('Server is running with '+PORT+' port')
})