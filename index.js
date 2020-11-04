
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
})

app.get('/users', (req,res) => {
    res.render('users');
})
app.post('/contact', (req,res)=> {
    console.log(req.body);
    res.redirect('back'); 
})

app.listen(port, () => {
    console.log('Connected to the port: '+ port);
})