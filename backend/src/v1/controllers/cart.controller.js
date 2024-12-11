'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");


class CartController {
  /**
   * @desc add to cart for user
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  addToCart = async (req, res, next) => {
    new CREATED({
      message: "Created User Cart Success!!!",
      metadata: await CartService.addToCart(req.body)
    }).send(res);
  }

  update = async (req, res, next) => {
    new CREATED({
      message: "Updated User Cart Success!!!",
      metadata: await CartService.addToCartV2(req.body)
    }).send(res);
  }

  delele = async (req, res, next) => {
    new CREATED({
      message: "Deleted User Cart Success!!!",
      metadata: await CartService.deleteUserCart(req.body)
    }).send(res);
  }

  findUserCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Find User Cart Success!!!",
      metadata: await CartService.findUserCart(req.query)
    }).send(res);
  }

}

module.exports = new CartController()