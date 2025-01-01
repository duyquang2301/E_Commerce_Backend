'use strict';

const { randomInt } = require('crypto')
const OPT = require('../models/opt.model');

const generatorTokenRandom = () => {
  const token = randomInt(0, Math.pow(2, 32))
  return token
}


const newOpt = async ({ email }) => {
  const token = generatorTokenRandom()
  const newToken = OPT.create({
    opt_token: token,
    opt_email: email
  })

  return newToken
}


module.exports = {
  newOpt
}