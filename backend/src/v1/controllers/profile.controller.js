'use strict';

const { SuccessResponse } = require("../core/success.response");


const dataProfiles = [
    {
        user_id: 1,
        user_name: "Nguyen Van A",
        user_avatar: "https://via.placeholder.com/150",
    },
    {
        user_id: 2,
        user_name: "Nguyen Van B",
        user_avatar: "https://via.placeholder.com/150",
    },
    {
        user_id: 3,
        user_name: "Nguyen Van C",
        user_avatar: "https://via.placeholder.com/150",
    }
]

class ProfileController {
    // admin 
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all profiles",
            metadata: dataProfiles
        }).send(res);
    }

    profile = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all profiles",
            metadata: dataProfiles
        }).send(res);
    }
}


module.exports = new ProfileController();