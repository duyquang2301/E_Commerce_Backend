'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");


class CheckoutController {

  checkoutReview = async (req, res, next) => {
    new CREATED({
      message: "Checkout Review Success!!!",
      metadata: await CheckoutService.checkoutReview(req.body)
    }).send(res);
  }

}

module.exports = new CheckoutController()