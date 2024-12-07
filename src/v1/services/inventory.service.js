"use strict";

const { BadRequestError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { findProductById } = require("../models/repository/product.repository");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "440 Phan Dang Luu Street, Da Nang",
  }) {
    const product = await findProductById(productId);
    if (!product) throw new BadRequestError('The Product does not exist!!!');

    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location
        }
      }, option = { upsert: true, new: true }

    return await inventory.findOneAndUpdate(query, updateSet.option);
  }
}

module.exports = InventoryService