
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
app.use('/organisation/event', express.static('public')); 
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


const organizationRoute = require('./routes/organization.js');
app.use('/organisation', organizationRoute);
\
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

app.listen(port, () => {
    console.log('Connected to the port: '+ port);
});

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
app.listen(port, () => {
    console.log('Connected to the port: '+ port);
});