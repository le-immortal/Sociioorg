const express = require('express');
const mailer = express.Router();
const nodemailer = require('nodemailer');

const dotenv = require('dotenv');
require('dotenv').config();
// const  {google} = require('googleapis');
// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//     process.env.clientId,
//     process.env.clientSecret,
//     "https://developers.google.com/oauthplayground" 
// )
// ;
// oauth2Client.setCredentials({
//     refresh_token:process.env.refreshToken
// });
// const email = process.env.email;
// console.log(email);
// const accessToken = oauth2Client.getAccessToken();

 
mailer.use(express.json());
mailer.use(express.static("public"));

mailer.post('/', (req, res) => {
    try {
        var mail = {
            from: req.body.name,
            to: process.env.email,
            subject: "Mail From Contact Form", 
            text: req.body.name + '\n' + req.body.emailid + '\n' + req.body.telnum + '\n'+ req.body.message
            
        };
    
        console.log(req.body);
        transporter.sendMail(mail, function (err, info) {
            if (err) {
                console.log(err);
                console.log('send tak aagya');
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
});


module.exports = mailer;
