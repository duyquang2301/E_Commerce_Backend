"use strict";

const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {


  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout Success!!!",
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  }


  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Register OK!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res);
  };
}

module.exports = new AccessController();
