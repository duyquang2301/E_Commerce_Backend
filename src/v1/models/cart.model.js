"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

var cartSchema = new Schema(
  {
    cart_state: {
      type: String, required: true,
      enum: ['active', 'completed', 'failed', 'pending'],
      default: 'active'
    },
    cart_products: {
      type: Array, required: true, default: []
    },
    cart_count_product: { type: Number, required: true },
    cart_userId: { type: Number, required: true }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema)
}
