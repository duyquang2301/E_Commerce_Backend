"use strict";

const { Schema, model } = require("mongoose");
const slugify = require("slugify")

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

var productSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_thumb: {
    type: String,
    required: true
  },
  product_description: String,
  product_slug: String,
  product_price: {
    type: Number,
    required: true
  },
  product_quantity: {
    type: Number,
    required: true
  },
  product_type: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Furniture']
  },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  product_attributes: {
    type: Schema.Types.Mixed,
    required: true,
  },
  product_ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be above 5.0'],
    set: (val) => Math.round(val * 10) / 10
  },
  product_variations: {
    type: Array,
    default: []
  },
  isDraf: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
}, {
  timestamps: true,
  collection: COLLECTION_NAME,
}
);

// create index for search
productSchema.index({ product_name: "text", product_description: 'text' })

// document middleware: runs before save and create 
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
})

const clothingSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  material: String,
  size: Array,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
  timestamps: true,
  collection: "clothes",
});

const electronicSchema = new Schema({
  manufacture: {
    type: String,
    required: true,
  },
  model: String,
  color: String,
  product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
}, {
  timestamps: true,
  collection: "electronics",
});

const furnitureSchema = new Schema({
  material: {
    type: String,
    required: true,
  },
  dimensions: String,
  weight: Number,
  product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
}, {
  timestamps: true,
  collection: "furnitures",
});

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronics", electronicSchema),
  furniture: model("Furniture", furnitureSchema),
}
