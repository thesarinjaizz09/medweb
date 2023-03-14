const express = require("express");
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const uuid = require('./lib/generators/uuid')
const connectToMongoDB = require('./db/connect-to-mongo')
const users = require('./db/routes/users')
const nodemailer = require('nodemailer')
require('dotenv').config()

const server = express();
const PORT = process.env.PORT || 1337
const serverConnectionURI = uuid(40)
const databaseConnectionURI = uuid(40)

connectToMongoDB(databaseConnectionURI)

server.use(express.json())
server.use(cors())
server.use(morgan('common'))
server.use('/api/auth', users)

const sendMailToHospitals = () => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAILUSERNAME,
            pass: process.env.MAILPASSWORD,
            clientId: process.env.OAUTHCLIENTID,
            clientSecret: process.env.OAUTHCLIENTSECRET,
            refreshToken: process.env.OAUTHREFRESHTOKEN
        }
    });

    let mailOptions = {
        from: 'souvikindia7@gmail.com',
        to: 'jazzsarin28@gmail.com',
        subject: 'Emergency request',
        text: 'This is a mail requesting an emergency request'
    }

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    });

    return 'success'
}

server.get('/api/auth/emergency', (req, res) => {
    try {
        const message = sendMailToHospitals()
        if (message === 'success') {
            res.send({
                type: 'success'
            })
        }

    } catch (err) {
        res.send({
            type: 'error'
        })
    }
})

server.listen(PORT, () => {
    console.log(`X--- MedWeb express server succesfully connected ---X`)
    console.log(`X--- MedWeb express server connection uri: ${serverConnectionURI} ---X`)
})