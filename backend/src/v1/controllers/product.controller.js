"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service.xxxx");
const { findSku } = require("../services/sku.service");
const { newSpu, findSpu } = require("../services/spu.service");

class ProductController {
  FindOneSpu = async (req, res, next) => {
    try {
      const { product_id } = req.query;

      new SuccessResponse({
        message: "Find spu success!!!",
        metadata: await findSpu({ spu_id: product_id }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  FindOneSku = async (req, res, next) => {
    try {
      const { sku_id, product_id } = req.query;

      new SuccessResponse({
        message: "Find spu success!!!",
        metadata: await findSku({ sku_id, product_id }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  createSpu = async (req, res, next) => {
    try {
      const spu = await newSpu({ ...req.body, product_shop: req.user.userId });

      new CREATED({
        message: "create spu success!!!",
        metadata: spu,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req, res, next) => {
    new CREATED({
      message: "Create new product success!!",
      // metadata: await ProductFactory.createProduct(req.body.product_type, {
      //   ...req.body,
      //   product_shop: req.user.userId
      // })
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new CREATED({
      message: "publishProductByShop success!!!",
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new CREATED({
      message: "unPublishProductByShop success!!!",
      metadata: await ProductFactory.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

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
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  findAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "find published list shop",
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  findProductBySearch = async (req, res, next) => {
    new SuccessResponse({
      message: "Find Product By Search Success!!!",
      metadata: await ProductFactory.findProductBySearch(req.params),
    }).send(res);
  };

  findProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Find Product Success!!!",
      metadata: await ProductFactory.findProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Find Product Success!!!",
      metadata: await ProductFactory.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new CREATED({
      message: "Update Product Success",
      metadata: await ProductFactory.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
