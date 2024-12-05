"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service.xxxx");

class ProductController {
  createProduct = async (req, res, next) => {
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


  /**
   * @desc Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip 
   * @return {JSON}
   */
  findAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "find draft list shop",
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }
}

module.exports = new ProductController();
