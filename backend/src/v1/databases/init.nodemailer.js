'use strict';

const nodemailer = require('nodemailer');

const transports = nodemailer.createTransport({
    host: "",
    port: "",
    secure: true,
    auth: {
        user: "",
        pass: ""
    }
})

module.exports = transports