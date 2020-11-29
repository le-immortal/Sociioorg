const admin = require('firebase-admin'),
    firebase = require('firebase'),
    express = require('express'),
    bodyParser = require('body-parser');
const { clouddebugger } = require('googleapis/build/src/apis/clouddebugger');
const { doubleclickbidmanager } = require('googleapis/build/src/apis/doubleclickbidmanager');
router = express.Router();
router.use(bodyParser.json());
db= admin.firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;

router.route('/new')
.get( (req,res) => {
    res.render('newEvent');
})
.post(async(req,res)=>{
    try{
        var dt = req.body.date + 'T'+ req.body.time+':00';
        var datetime = new Date(dt);
        var organisationId = await firebase.auth().currentUser.uid;
        const data = {
           name: req.body.name,
           organisationId:  organisationId,
           dateTime: datetime,
           description: req.body.description,
           location: req.body.location,
           isFinished: false
        }
        console.log(req.body.date + " " + req.body.time);
        const addData = await db.collection('events')
                            .add(data);
        addData.get()
         .then(async(snapshot) =>{
             var id = snapshot.id;
             console.log(snapshot.id +'\n'+ snapshot.data().location);
             const updateOrg = await db.collection('organisation')
                                       .doc(organisationId)
                                       .update({"events": FieldValue.arrayUnion(id)})
                                       .then(snapshot =>{
                                        console.log('updated successfully');
                                       });            
         })
        res.send('success');
    }
    catch (err){
        res.send(err);
    }
})


// app.post('/organization/manageCurrent', (req,res) => {
//     const ID = req.body.eventId;
// db.collection('events').doc(ID).get().then(doc =>{
//     if(doc.exists){
//         db.collection('events').doc(ID).update({
//             organisationId: req.body.organisationId,
//             dateTime: req.body.dateTime,
//             description: req.body.description,
//             duration: req.body.duration,
//             isFinished: req.body.isFinished,
//             eventName: req.body.eventName,
//             location: req.body.location,
//         });
//         // redirect somewhere else
//     }
//     else{
//         console.log("no such event exists");
//         // redirect somewhere else
//     }
// });
// });

// app.get('/organization/manageCurrent/:eventId', (req,res) => {

//     res.render('events');
// });

router.get('/past', async (req,res) => {
    try{
        // var organisationId = await firebase.auth().currentUser.uid;

        var organisationRef = db.collection('organisation')
                    .doc('1234');
        console.log('Events');
        var getEvent = organisationRef.get()
                                      .then(async (snapshot) => {
                                            var events = snapshot.data().events;
                                                if(!events){
                                                    var message = 'You have no events in record. Create a new event to get started.';
                                                    console.log('No event');
                                                    res.send(message);
                                                }
                                                else{
                                                    console.log('Event');
                                                    pastEvents = [];
                                                    for(x of events){
                                                        var checkEvent = await db.collection('events')
                                                                            .doc(x);
                                                        var check = await checkEvent.get();        
                                                            if(check.data().isFinished){
                                                                var usersAttended = await checkEvent.collection('users').where('hasAttended', '==', true).get().then(snapshot => {
                                                                    return snapshot.size;
                                                                })
                                                                var usersRegistered = await checkEvent.collection('users').where('hasRegistered', '==', true).get().then(snapshot => {
                                                                    return snapshot.size;
                                                                })
                                                                var data = check.data();
                                                                data['eventId'] = x;
                                                                data['usersAttended'] = usersAttended;
                                                                data['usersRegistered'] = usersRegistered;
                                                                pastEvents.push(data);
                                                            }else{
                                                                continue;
                                                            }
                                                             
                                                    }
                                                    console.log(pastEvents);
                                                    res.render('pastEvent', pastEvents);
                                                   
                                                }
                                            })

                    
        // res.render('pastEvent');
                            
    }
    catch(err){
        res.send(err);
    }
});

// app.get('/organization/create', (req,res) => {

//     res.render('createEvent');
// });

// app.post('/organization/create', (req,res) => {
//     const newEventData = {
//             organisationId: req.body.organisationId,
//             dateTime: req.body.dateTime,
//             description: req.body.description,
//             duration: req.body.duration,
//             isFinished: false,
//             eventName: req.body.eventName,
//             location: req.body.location,
//             latitude: req.body.latitude,
//             longitude: req.body.longitude,
//     }

//     db.collection('events').add(newEventData).then(() => {
//         console.log('new event created');
//         // redirect somewhere else
//     });
// });

module.exports = router;
