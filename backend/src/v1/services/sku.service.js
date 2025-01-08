"use strict";

const { randomProductId } = require("../utils");
const SKU_MODEL = require("../models/sku.model");
const _ = require("lodash");
const { CACHE_PRODUCT } = require("../configs/constant");
const {
  getCacheIO,
  setCacheIOExpiration,
} = require("../models/repository/cache.repository");

const newSku = async ({ spu_id, sku_list }) => {
  try {
    const convert_sku_list = sku_list.map((sku) => {
      return {
        ...sku,
        product_id: spu_id,
        sku_id: `${spu_id}.${randomProductId()}`,
      };
    });
    const skus = await SKU_MODEL.create(convert_sku_list);

    return skus;
  } catch (error) {
    return [];
  }
};

const findSku = async ({ sku_id, product_id }) => {
  try {
    if (sku_id < 0) return null;
    if (product_id < 0) return null;

    const skuKeyCache = `${CACHE_PRODUCT.SKU}${sku_id}`;
    // let skuCache = await getCacheIO({ key: skuKeyCache });

    // if (skuCache) {
    //   return {
    //     ...JSON.parse(skuCache),
    //     toLoad: "cache",
    //   };
    // }

    // if (!skuCache) {
    const skuCache = await SKU_MODEL.findOne({
      sku_id,
      product_id,
    }).lean();

    const valueCache = skuCache ? skuCache : null;
    setCacheIOExpiration({
      key: skuKeyCache,
      value: JSON.stringify(valueCache),
      expirationSeconds: 30,
    }).then();
    // }

    return {
      skuCache,
      toLoad: "database",
    };

    //  const sku = await SKU_MODEL.findOne({
    //    sku_id,
    //    product_id,
    //  }).lean();
    // if (sku) {
    // }

    // return _.omit(sku, ["__v", "updatedAt", "createdAt", "isDeleted"]);
  } catch (error) {
    return error;
  }
};

const findSkuBySpuId = async ({ product_id }) => {
  try {
    const skus = await SKU_MODEL.find({ product_id }).lean();
    return skus;
  } catch (error) {
    return error;
  }
};

module.exports = {
  newSku,
  findSku,
  findSkuBySpuId,
};
