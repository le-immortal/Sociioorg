
// requiring and using NPM packages
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const logger = require('morgan');

const port = 3000;
const app=express();
app.set('views', './views');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended:true,  useUnifiedTopology: true }));
app.use(express.static("public"));
app.use('/organisation/', express.static('public')); 
var firebase = require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyDsPYloQohhbO-pWgPkS7hUEr9RYp2f-xk",
    authDomain: "sociio-fcc40.firebaseapp.com",
    databaseURL: "https://sociio-fcc40.firebaseio.com",
    projectId: "sociio-fcc40",
    storageBucket: "sociio-fcc40.appspot.com",
    messagingSenderId: "657686913396",
    appId: "1:657686913396:web:597d3457f7316b66a8cc21",
    measurementId: "G-YL786TV4Y9"
  };
firebase.initializeApp(firebaseConfig);

var admin = require("firebase-admin");

var serviceAccount = require("./serviceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sociio-fcc40.firebaseio.com"
});



app.use(logger('dev'));

// routes 
app.get('/', (req, res) => {
    try{
        res.render('index');
    }
    catch{
        console.log('Error');
    }
});

app.get('/aboutus', (req,res) => {

    res.render('aboutus');
});

app.get('/users', (req,res) => {

    res.render('users');
});

<<<<<<< HEAD
const organizationRoute = require('./routes/organization.js');
app.use('/organisation', organizationRoute);


// Contact Form 


const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
    app.use('/contact',(req, res) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
              type: "OAUTH2",
              user: process.env.email,  
              clientId: process.env.clientId,
              clientSecret: process.env.clientSecret,
              refreshToken: process.env.refreshToken,
              expires: 3599
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      try { 
        var mail = {
            from: req.body.name,
            to: process.env.email,
            subject: "Mail From Contact Form", 
            text: "Name: " + req.body.name + '\n' +
                "EmailId: " +req.body.emailid + '\n' +
                "Phone: " + req.body.telnum + '\n'+ 
                "Message: " +req.body.message
            
        };
    
        transporter.sendMail(mail, function (err, info) {
            if (err) {
                console.log(err);
                res.redirect('back');
            } else {
                res.redirect('back');

            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong. Try again later'
        });
    }
}
);
=======
app.get('/register', (req,res) => {
    res.render('registers');
});

app.get('/login', (req,res) => {

    res.render('login');
});

app.get('/organization', (req,res) => {

    res.render('organiztion');
});

app.get('/organization/manageCurrent', (req,res) => {

    res.render('manageCurrentEvents');
});

app.post('/organization/manageCurrent', (req,res) => {

});

app.get('/organization/manageCurrent/:eventId', (req,res) => {

    res.render('events');
});

app.get('/organization/pastEvents', (req,res) => {

    res.render('pastEvents');
});

app.get('/organization/manageProfile', (req,res) => {

    res.render('manageProfile');
});

app.post('/organization/manageProfile', (req,res) => {

});

app.get('/organization/create', (req,res) => {

    res.render('createEvent');
});

app.post('/organization/create', (req,res) => {

    res.redirect('/organization/manageCurrent');
});

app.get('/organization/manageOrganisers', (req,res) => {

    res.render('mangeOrganisers');
});

app.post('/organization/manageOrganisers', (req,res) => {

});

app.post('/contact', (req,res)=> {
    console.log(req.body);
    res.redirect('back'); 
});

// listen on local host or service host
>>>>>>> c77a50a7341386241a557048a8a960bea5fc0966

app.listen(port, () => {
    console.log('Connected to the port: '+ port);
});