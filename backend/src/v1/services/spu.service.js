"use strict";

const { findShopById } = require("../models/repository/shop.repository");
const { NotFoundError } = require("../core/error.response");
const SPU_MODEL = require("../models/spu.model");
const { randomProductId } = require("../utils");
const { newSku, findSkuBySpuId } = require("./sku.service");
const _ = require("lodash");

const newSpu = async ({
  product_id,
  product_name,
  product_thumb,
  product_description,
  product_price,
  product_category,
  product_shop,
  product_attributes,
  product_quantity,
  product_variations,
  sku_list = [],
}) => {
  try {
    const foundShop = await findShopById({
      shopId: product_shop,
    });

    if (!foundShop) throw new NotFoundError("Shop not found");

    const spu = await SPU_MODEL.create({
      product_id: randomProductId(),
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_category,
      product_shop,
      product_attributes,
      product_quantity,
      product_variations,
    });

    if (spu && sku_list.length) {
      newSku({ sku_list, spu_id: spu.product_id }).then();
    }

    return !!spu;
  } catch (error) {}
};

const findSpu = async ({ spu_id }) => {
  try {
    const spu = await SPU_MODEL.findOne({
      product_id: spu_id,
      isPublished: false,
    });

    if (!spu) throw new NotFoundError("spu not found");
    const skus = await findSkuBySpuId({ product_id: spu.product_id });

    return {
      spu_info: _.omit(spu, ["__v", "updatedAt", "createdAt", "isDeleted"]),
      sku_list: skus.map((sku) =>
        _.omit(sku, ["__v", "updatedAt", "createdAt", "isDeleted"])
      ),
    };
  } catch (error) {
    return {};
  }
};

module.exports = {
  newSpu,
  findSpu,
};
