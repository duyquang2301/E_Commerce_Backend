'use strict';

const USER = require('../models/user.model');
const { ErrorResponse } = require('../core/error.response')
const { SuccessResponse } = require('../core/success.response')

const newUser = async ({
    email = null,
    captcha = null,
}) => {
    /// 1. check email is exist 
    const user = USER.findOne({ email }).lean();
    if (user) {
        return ErrorResponse({
            message: "Email is already exist",
        })
    }

    return SuccessResponse({
        message: "Verify email user",
        metadata: {
            token
        }
    })
}


module.exports = {
    newUser
}