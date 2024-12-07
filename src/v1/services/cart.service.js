'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { findProductById } = require("../models/repository/product.repository");

class CartService {

  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_products: product
        }
      }, option = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, option)
  }


  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const existingCart = await cart.findOne({
      cart_userId: userId,
      cart_state: 'active'
    });
    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active'
    }, updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity
      }
    }, option = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, option);
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_products: {
            productId
          }
        }
      }

    return await cart.updateOne(query, updateSet)
  }

  static async findUserCart({ userId }) {
    return await cart.findOne({
      cart_userId: +userId
    }).lean()
  }


  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({
      cart_userId: userId
    });

    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    return await CartService.updateUserCartQuantity({ userId, product });
  }

  // update cart
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
    const foundProduct = await findProductById(productId);
    if (!foundProduct) throw new NotFoundError("Product not found");
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product not found");
    }

    if (quantity === 0) {
      // deleted
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
      }
    })
  }
}

module.exports = CartService