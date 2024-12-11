'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");


class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new CREATED({
      message: "Create Discount Success!!!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res);
  }

  // findDiscountCodes = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: "Find Discount Code Success!!!",
  //     metadata: await DiscountService.createDiscountCode({
  //       ...req.query,
  //       shopId: req.user.userId
  //     })
  //   }).send(res);
  // }

  findDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Find Discount Amount Success!!!",
      metadata: await DiscountService.findDiscountAmount({
        ...req.body
      })
    }).send(res);
  }

  findDiscountCodeByProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Find Discount Code By Product Success!!!",
      metadata: await DiscountService.findDiscountCodesByProduct({
        ...req.query,
      })
    }).send(res)
  }

  findDiscountCodeByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Find Discount Code By Shop Success!!!",
      metadata: await DiscountService.findDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res);
  }
}

module.exports = new DiscountController()