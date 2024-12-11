"use strict";

const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  // handlerRefreshToken = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: "Get Token Successfull",
  //     metadata: await AccessService.handlerFresherToken(req.body.refreshToken)
  //   }).send(res);
  // }

  handlerRefreshToken = async (req, res, next) => {
    console.log("-----------------------", req.user)
    new SuccessResponse({
      message: "Get Token Successfull",
      metadata: await AccessService.handlerFresherToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      })
    }).send(res);
  }


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
