'use strict'

const { BadRequestError } = require("../core/error.response");
const { order } = require("../models/order.model");
const { findCartById } = require("../models/repository/cart.repository");
const { checkProductByServer } = require("../models/repository/product.repository");
const { findDiscountAmount } = require("./discount.service");
const { acquired, releaseLock } = require("./redis.service");

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    const foundCart = await findCartById(cartId)
    if (!foundCart) throw new BadRequestError("Cart not found");

    const checkout_order = {
      totalPrice: 0,
      freeShip: 0,
      totalDicount: 0,
      totalCheckout: 0
    }, shop_order_ids_new = []

    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products } = shop_order_ids[i]
      const checkProductServer = await checkProductByServer(item_products)
      if (!checkProductServer[0]) throw new BadRequestError("order wrong");

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }

      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = await findDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        });

        checkout_order.totalDicount += discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;

      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }


  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address,
    user_payment
  }) {
    const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
      userId,
      cartId,
      shop_order_ids
    });

    const products = shop_order_ids_new.flatMap(order => order.item_products);

    const acquiredProduct = [];
    for (let i; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquired({ productId, quantity, cartId });
      acquiredProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquiredProduct.includes(false)) {
      throw new BadRequestError("some product were updated, please await minutes");
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_product: shop_order_ids_new
    });

    // insert success -> remove product-cart
    if (newOrder) {

    }

    return newOrder;
  }

  static async findOrderByUser() {

  }

  static async findOrderDetailByUser() {

  }

  static async cancelOrderByUser() {

  }

  static async updateOrderStatusByShop() {

  }
}

module.exports = CheckoutService