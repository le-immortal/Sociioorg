const admin = require('firebase-admin'),
    firebase = require('firebase'),
    express = require('express'),
    bodyParser = require('body-parser');
const { clouddebugger } = require('googleapis/build/src/apis/clouddebugger');
const { doubleclickbidmanager } = require('googleapis/build/src/apis/doubleclickbidmanager');
const ejs=require("ejs");
const serviceAccount = require('./sociio-fcc40-firebase-adminsdk-ou9bf-c896166075.json');
router = express.Router();
router.use(bodyParser.json());
router.set('views', './views');
router.set('view engine','ejs');
router.use(express.static("public"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

db= admin.firestore();


router.get('/new', (req,res) => {
    res.render('newEvent');

});

app.get('/organization/manageCurrent', (req,res) => {

    res.render('manageCurrentEvents');
});

app.post('/organization/manageCurrent', (req,res) => {
    const ID = req.body.eventId;
db.collection('events').doc(ID).get().then(doc =>{
    if(doc.exists){
        db.collection('events').doc(ID).update({
            organisationId: req.body.organisationId,
            dateTime: req.body.dateTime,
            description: req.body.description,
            duration: req.body.duration,
            isFinished: req.body.isFinished,
            eventName: req.body.eventName,
            location: req.body.location,
        });
        // redirect somewhere else
    }
    else{
        console.log("no such event exists");
        // redirect somewhere else
    }
});
});

app.get('/organization/manageCurrent/:eventId', (req,res) => {

    res.render('events');
});

app.get('/organization/pastEvents', (req,res) => {
    db.collection('events').get().then(collection => {
        if(collection.exists){
            console.log('no collection exists');
            // redirect somewhere else
        }
        else {
            const allFinished = await collection.where('isFinished', '==', true).get();
            if(allFinished.empty) {
                console.log("no past events");
                // redirect somewhere else
            }
            allFinished.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                // res.render ejs file 
              });
        }
    })
    .catch(err => {
        console.log('Error getting events', err);
        process.exit();
        // redirect somewhere else
    })
});

app.get('/organization/create', (req,res) => {

    res.render('createEvent');
});

app.post('/organization/create', (req,res) => {
    const newEventData = {
            organisationId: req.body.organisationId,
            dateTime: req.body.dateTime,
            description: req.body.description,
            duration: req.body.duration,
            isFinished: false,
            eventName: req.body.eventName,
            location: req.body.location,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
    }

    db.collection('events').add(newEventData).then(() => {
        console.log('new event created');
        // redirect somewhere else
    });
});

module.exports = router;
