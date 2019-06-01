const aws = require('aws-sdk')
const nodemailer = require('nodemailer')
const fs = require('fs')
const YAML = require('yaml')
const file = fs.readFileSync('../secrets.dev.yml', 'utf8')

const config = YAML.parse(file)
aws.config.update(config)
const SES = new aws.SES()

const sendMessage = async (event) => {
  try {
    const { name, email, message } = JSON.parse(event.body)
    const mailOptions = {
      from: 'hornyak.laszlo88@gmail.com',
      subject: `${name} - ${email} sent a message from laszlo-hornyak.com`,
      html: message,
      to: 'hornyak.laszlo88@gmail.com'
    }

    // create Nodemailer SES transporter
    const transporter = nodemailer.createTransport({
      SES
    })

    // send email
    await transporter.sendMail(mailOptions)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Email sent successfully' })
    }
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Email sending failed', data: config })
    }
  }
}

module.exports = {
  sendMessage
}
