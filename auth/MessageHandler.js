const aws = require('aws-sdk');
const nodemailer = require('nodemailer');
const config = require('../config.json');

aws.config.update(config);
const ses = new aws.SES();

/* 
 * Functions
 */
module.exports.sendMessage = (event, context, callback) => {
    const {name, email, message} = JSON.parse(event.body);
    const mailOptions = {
        from: 'hornyak.laszlo88@gmail.com',
        subject: `${name} - ${email} sent a message from laszlo-hornyak.com`,
        html: message,
        to: 'hornyak.laszlo88@gmail.com'
    };

    // create Nodemailer SES transporter
    const transporter = nodemailer.createTransport({
        SES: ses
    });

    // send email
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                statusCode: 200,
                body : JSON.stringify({message: 'Email sent successfully'})
            });
        }
    });
};
