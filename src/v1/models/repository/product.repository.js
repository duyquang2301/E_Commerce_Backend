'use strict'

const { Types } = require("mongoose")
const { product, electronic, clothing, furniture } = require("../product.model")

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const publicProductByShop = async ({ product_shop, product_id }) => {
  console.log("product_shop:", product_shop);
  console.log("product_id:", product_id);
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })

  console.log("--------------------", foundShop)

  if (!foundShop) return null;

  foundShop.isDraf = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.update(foundShop);

  console.log("--------------------modifiedCount", await foundShop.update(foundShop))

  return modifiedCount;
}

const queryProduct = async ({ query, limit, skip }) => {
  return await product.find(query)
    .populate('product_shop', 'name, email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

module.exports = {
  findAllDraftsForShop,
  publicProductByShop,
  findAllPublishForShop
}