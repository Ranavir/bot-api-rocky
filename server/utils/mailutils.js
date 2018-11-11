// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


var spoofEmail = async (msg)=>{
  console.log('start sending mail...');
  try{
    await sgMail.send(msg);
    console.log('end sending mail...');
    return `Email sent successfully to ${msg.to}`;
  }catch(err){
    return `Email sending failed. Please try after some time.`;
  }

};

module.exports = {spoofEmail};
