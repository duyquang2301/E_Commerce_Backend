"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

var orderSchema = new Schema(
  {
    order_userId: { type: Number, reuqired: true },
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_product: { type: Array, required: true },
    order_trackingNumber: { type: String, default: '#00001180552024' },
    order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' }
  },
  {
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOne"
    },
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  order: model(DOCUMENT_NAME, orderSchema)
}
