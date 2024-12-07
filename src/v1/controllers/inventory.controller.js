'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");


class InventoryController {

  addStockToInventory = async (req, res, next) => {
    new CREATED({
      message: "Checkout Review Success!!!",
      metadata: await InventoryService.addStockToInventory(req.body)
    }).send(res);
  }

}

module.exports = new InventoryController()