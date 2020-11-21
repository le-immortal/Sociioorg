const admin = require('firebase-admin'),
    firebase = require('firebase'),
    express = require('express');
const { clouddebugger } = require('googleapis/build/src/apis/clouddebugger');
const { doubleclickbidmanager } = require('googleapis/build/src/apis/doubleclickbidmanager');
router = express.Router();
db= admin.firestore();

/* login function */
async function loggedIn(req, res, next){
    var user = firebase.auth().currentUser;
    if(user){
    await db.collection('organisers')
    .doc(user.uid)
    .get()
    .then(snapshot => {
        console.log(snapshot.data());
        if(snapshot.data().isVerified){
       
            next();
          
        }
        else{
            res.send('notLoggedIn');
        }
    })
}
else{
    res.send('no user exits');
}
}

/* login function */

router.get('/', async(req,res) => {
    try{
        var user =await firebase.auth().currentUser;
        if(user){
        db.collection('organisers')
          .doc(user.uid)
          .get()
          .then(snapshot =>{
            if(snapshot.data().isVerified){
                res.render('profile', snapshot.data()); 
            }
            else{
                console.log('not exists');
               
                res.render('verify');
                
            }
              
          })
        }
        else{
            res.render('organisation');
        }
    }
    catch (err){
        res.send(err);
    }
})

router.post('/login', async(req, res) => {
   try{
       await firebase
            .auth().
            signInWithEmailAndPassword(req.body.email, req.body.password)
            .then(() =>{
               res.redirect('/organisation');
            })
   }catch (err) {
       
    res.send(err.message);
    
}
    
});

router.get('/userloggedin',loggedIn, (req, res) =>{
    res.send('success');
})

router.get('/logout', async(req, res) => {
    try {
        var user = firebase.auth().currentUser;
        await firebase
            .auth()
            .signOut()
            .then(() => {
                if(user){

                    console.log(user.email);
                }
                res.redirect('/organisation');
            });
    } catch (err) {
        console.log(err);
        res.send('failed to logout');
    }
});
router.post('/signup', async(req,res) => {
    try{
        var email = req.body.email;
        var password = req.body.password;

     
        await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async() => {
                try {
                    var user = firebase.auth().currentUser;
                    const data = {
                        organisationName : req.body.organisation,
                        contactNumber : req.body.contact,
                        website : req.body.website,
                        registrationDocumentLink: req.body.registered,
                        isVerified: false,
                        email: email,
                        uid: user.uid
                        }
                    await db
                        .collection('organisers')
                        .doc(user.uid)
                        .set(data)
                        .then(doc => {
                            return console.log('Created:', doc.id); // eslint-disable-next-line handle-callback-err
                        });
                 res.redirect('/organisation');
                } catch (err) {
                    console.log(err);
                }
            })
            .catch(err => {
                console.log(err);
                res.redirect('/organisation');
            });

    }
    catch (err) {
        console.log(err);
        res.redirect('/organisation');
    }
})



module.exports = router;