const nodemailer = require('nodemailer');
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
          accessToken: accessToken,
          expires: 3599
    },
    tls: {
      rejectUnauthorized: false
    }
  });
module.exports = transporter;   