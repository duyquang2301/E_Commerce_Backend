"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service.xxxx");

class ProductController {
  createProduct = async (req, res, next) => {
    console.log("-------------------", req.user)
    new CREATED({
      message: "Create new product success!!",
      // metadata: await ProductFactory.createProduct(req.body.product_type, {
      //   ...req.body,
      //   product_shop: req.user.userId
      // })
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res);
  }
}

module.exports = new ProductController();
