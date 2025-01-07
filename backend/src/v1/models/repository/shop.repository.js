"use strict ";

const SHOP_MODEL = require("../shop.model");

const selectStruct = {
  email: 1,
  name: 1,
  status: 1,
  roles: 1,
};

const findShopById = async ({ shopId, select = selectStruct }) => {
  return await SHOP_MODEL.findById(shopId).select(select);
};

module.exports = { findShopById };
