'use strict'

const { Types } = require("mongoose")
const { product, electronic, clothing, furniture } = require("../product.model")
const { getSelectData, unSelectData, convertToObjectIdMongodb } = require("../../utils")

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const publicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })

  if (!foundShop) return null;

  foundShop.isDraf = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.update(foundShop);

  return modifiedCount;
}

const unPublicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })

  if (!foundShop) return null;

  foundShop.isDraf = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.update(foundShop);

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

const findProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

  return products;
}

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unSelectData(unSelect))
}

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  const results = await product.find({
    isPublished: true,
    $text: { $search: regexSearch }
  }, {
    score: { $meta: "textScore" }
  })
    .sort({
      score: { $meta: "textScore" }
    })
    .lean()

  return results
}

const updateProductById = async ({ product_id, bodyUpdate, model, isNew = true }) => {
  return await model.findByIdAndUpdate(product_id, bodyUpdate, {
    new: isNew,
  })
};

const findProductById = async (productId) => {
  return await product.findOne({ _id: convertToObjectIdMongodb(productId) })
}


const checkProductByServer = async (products) => {
  return await Promise.all(products.map(async product => {
    const foundProduct = await findProductById(product.productId);
    if (foundProduct) {
      return {
        price: foundProduct.product_price,
        quantity: foundProduct.product_quantity,
        produtcId: foundProduct.productId
      }
    }
  }))
}

module.exports = {
  findAllDraftsForShop,
  publicProductByShop,
  findAllPublishForShop,
  unPublicProductByShop,
  searchProductByUser,
  findProducts,
  findProduct,
  updateProductById,
  findProductById,
  checkProductByServer
}