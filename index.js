
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

app.get('/organization/manageCurrent/:eventId', (req,res) => {

    res.render('events');
});

app.get('/organization/pastEvents', (req,res) => {

    res.render('pastEvents');
});

app.get('/organization/manageProfile', (req,res) => {

    res.render('manageProfile');
});

app.get('/organization/create', (req,res) => {

    res.render('reateEvent');
});

app.post('/contact', (req,res)=> {
    console.log(req.body);
    res.redirect('back'); 
});

app.get('/aboutus', (req,res) => {

    res.render('aboutus');
});

// listen on local host or service host

app.listen(port, () => {
    console.log('Connected to the port: '+ port);
});