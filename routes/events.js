const admin = require('firebase-admin'),
    firebase = require('firebase'),
    express = require('express'),
    bodyParser = require('body-parser');
const { clouddebugger } = require('googleapis/build/src/apis/clouddebugger');
const { doubleclickbidmanager } = require('googleapis/build/src/apis/doubleclickbidmanager');
router = express.Router();
router.use(bodyParser.json());
db = admin.firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;

//Create New Event


router.route('/new')
    .get((req, res) => {
        res.render('newEvent');
    })
    .post(async (req, res) => {
        try {
            var dt = req.body.date + 'T' + req.body.time + ':00';
            var datetime = new Date(dt);
            var organisationId = await firebase.auth().currentUser.uid;
            const data = {
                name: req.body.name,
                organisationId: organisationId,
                dateTime: datetime,
                description: req.body.description,
                location: req.body.location,
                isFinished: false
            }
            console.log(req.body.date + " " + req.body.time);
            const addData = await db.collection('events')
                .add(data);
            addData.get()
                .then(async (snapshot) => {
                    var id = snapshot.id;
                    console.log(snapshot.id + '\n' + snapshot.data().location);
                    const updateOrg = await db.collection('organisation')
                        .doc(organisationId)
                        .update({ "events": FieldValue.arrayUnion(id) })
                        .then(snapshot => {
                            console.log('updated successfully');
                        });
                })
            res.send('success');
        }
        catch (err) {
            res.send(err);
        }
    })

router.route('/profile')
    .get(async (req, res) => {
        // var organisationId = await firebase.auth().currentUser.uid;
        var orgRef = await db.collection('organisation')
            .doc('aQfrNGkulDN9h3QYkf4oMJiDrj63');

        var data = await orgRef.get().then(snapshot => {
            return snapshot.data();
        })
        console.log(data);
        var organiserRef = data.organisers;
        console.log(organiserRef);
        var organisers = await db.collection('users').where('uid','in',organiserRef)
                                                     .get()
                                                     .then(snap => {
                                                         var organ = [];
                                                        snap.forEach(doc => {
                                                            organ.push(doc.data());
                                                        });
                                                        return organ;
                                                     })
        console.log(organisers);
        res.render('manageProfile', {data, organisers});
    })
    .post(async (req, res) => {
        // var organisationId = await firebase.auth().currentUser.uid;
        console.log(req.body);
        var update = await db.collection('organisation')
            .doc('aQfrNGkulDN9h3QYkf4oMJiDrj63')
            .update(req.body)
            .then(snapshot => {
                res.redirect('back');
            })
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

router.get('/past', async (req, res) => {
    try {
        // var organisationId = await firebase.auth().currentUser.uid;

        var organisationRef = db.collection('organisation')
            .doc('1234');
        console.log('Events');
        var getEvent = organisationRef.get()
            .then(async (snapshot) => {
                var events = snapshot.data().events;
                if (!events) {
                    var message = 'You have no events in record. Create a new event to get started.';
                    // console.log('No event');
                    res.render('pastEvent', { message: message });
                }
                else {
                    // console.log('Event');
                    pastEvents = [];
                    count = 0;
                    for (x of events) {
                        var checkEvent = await db.collection('events')
                            .doc(x);
                        var check = await checkEvent.get();
                        if (!check.data().isFinished) {
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
                            data['count'] = count++;
                            pastEvents.push(data);
                        } else {
                            continue;
                        }

                    }
                    // console.log(pastEvents);
                    res.render('pastEvent', { pastEvents, message: false });

                }
            })


        // res.render('pastEvent');

    }
    catch (err) {
        res.send(err);
    }
});

router.get('/manage', async (req, res) => {
    try {
        // var organisationId = await firebase.auth().currentUser.uid;

        var organisationRef = db.collection('organisation')
            .doc('1234');
        console.log('Events');
        var getEvent = organisationRef.get()
            .then(async (snapshot) => {
                var events = snapshot.data().events;
                if (!events) {
                    var message = 'You currently do not have any event in coming future.';
                    // console.log('No event');
                    res.render('manageEvent', { message: message });
                }
                else {
                    // console.log('Event');
                    Events = [];
                    var countm = 0;
                    for (x of events) {
                        var checkEvent = await db.collection('events')
                            .doc(x);
                        var check = await checkEvent.get();
                        if (check.data().isFinished) {
                            var usersFollowed = await checkEvent.collection('users').where('hasRegistered', '==', false).get().then(snapshot => {
                                return snapshot.size;
                            })
                            var usersRegistered = await checkEvent.collection('users').where('hasRegistered', '==', true).get().then(snapshot => {
                                return snapshot.size;
                            })
                            var data = check.data();
                            data['eventId'] = x;
                            data['usersFollowed'] = usersFollowed;
                            data['usersRegistered'] = usersRegistered;
                            data['count'] = countm++;
                            Events.push(data);
                        } else {
                            continue;
                        }

                    }
                    // console.log(Events);
                    res.render('manageEvent', { Events, message: false });

                }
            })


        // res.render('pastEvent');

    }
    catch (err) {
        res.send(err);
    }
});


router.post('/message', async (req, res) => {
    try {
        console.log(req.body);
        var organisationId = await firebase.auth().currentUser.uid;
        await db.collection('events')
            .doc(req.body.eventId)
            .collection('messages')
            .add({
                eventId: req.body.eventId,
                text: req.body.message,
                senderName: 'admin',
                senderUid: organisationId

            })
            .then(() => {
                res.redirect('back');
            })


    }
    catch (err) {
        console.log(err.message);
        res.send(err);
    }
})

router.post('/organiser/add', async(req,res) =>{
    console.log(req.body.phoneNumber);
    var organiser = await db.collection('users')
                            .where('phoneNumber', '==', req.body.phoneNumber)
                            .get()
                            .then(async(snap) => {
                                if(snap.empty){
                                    res.send('User doesnt exist');
                                }
                                else{
                                    // organisationId = await firebase.auth().currentUser.uid;

                                    
                                }
                                snap.forEach(async(doc) => {
                                    console.log(doc.data());
                                    await db.collection('organisation')
                                    .doc('aQfrNGkulDN9h3QYkf4oMJiDrj63')
                                    .update({ "organisers": FieldValue.arrayUnion(doc.data().uid) })
                                    .then(()=>{
                                        res.redirect('back')
                                    })
                                });
                            })
                           


   

})
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
