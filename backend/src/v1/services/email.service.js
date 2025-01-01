'use strict';

const { randomInt } = require('crypto');
const { newOpt } = require('./opt.service');
const { getTemplate } = require('./template.service');
const { transporter } = require('../databases/init.nodemailer');
const { NotFoundError } = require('../core/error.response');
const { replacePlaceholder } = require('../utils');

const sendEmailLinkVerify = async ({
  html,
  toEmail,
  subject = 'Verify Email Registered',
  text = 'Verify'
}) => {
  try {
    const mailOptions = {
      from: '"Shop Dev" <duyquang.tdq7@gmail.com>',
      to: toEmail,
      subject,
      text,
      html
    }

    transporter.send(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  } catch (error) {
    console.error(error);
    return error;
  }
}

const sendEmailToken = async (email = null) => {
  try {
    // 1. generate token
    const token = await newOpt({ email });
    // 2. get template
    const template = await getTemplate({
      tem_name: "HTML EMAIL TOKEN"
    });

    if (!template) {
      return new NotFoundError('Template not found');
    }

    const content = replacePlaceholder(
      template.tem_html,
      {
        link_verify: `http://localhost:3000/verify?token=${token.opt_token}`
      }
    )

    // 3. send email
    sendEmailLinkVerify({
      html,
      toEmail: email,
      subject: "Verify Email",
    }).catch

    return 1;
  } catch (error) {

  }
}

module.exports = {
  sendEmailToken
}