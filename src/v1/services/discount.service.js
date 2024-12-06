"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const {
  findDiscountCodesUnselect,
  checkDiscountExist,
  findDiscountCodesSelect,
} = require("../models/repository/discount.repository");
const {
  findProduct,
  findProducts,
} = require("../models/repository/product.repository");
const { convertToObjectIdMongodb } = require("../utils");

/**
 * Discount Services
 *
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_used,
      uses_count,
      limit_uses,
    } = payload;

    const now_date = new Date();
    const start_day = new Date(start_date);
    const end_day = new Date(end_date);

    if (now_date < start_day || now_date > end_day) {
      throw new BadRequestError("Discount code has expired");
    }

    if (start_day >= end_day) {
      throw new BadRequestError("Start date must be before end date");
    }

    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discont Exist");
    }

    const newDiscount = discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_uses: max_uses,
      discount_limit_uses: limit_uses,
      discount_start_date: start_day,
      discount_end_date: end_day,
      discount_uses_count: uses_count,
      discount_users_used: uses_used,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: product_ids,
    });

    return newDiscount
  }

  static updateDiscountCode() { }

  static async findDiscountCodesByProduct({
    code,
    shopId,
    userId,
    limit,
    pape,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("discount not exist");
    }

    let products;
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    if (discount_applies_to === "all") {
      products = await findProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +pape,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      products = await findProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +pape,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  static async findDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      select: ["discount_name", "discount_code"],
      model: discount,
    });

    return discounts;
  }

  /**
   * Apply discount code
   */
  static async findDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("discount not found");

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_limit_uses,
      discount_users_used,
      discount_type,
      discount_value
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError("discount expired!");
    if (!discount_max_uses) throw new NotFoundError("discount are out!");
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > discount_end_date
    ) {
      throw new NotFoundError("discount expired!");
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {

      totalOrder = products.reduce((acc, product) => {
        console.log("------product", product.quantity, product.price)
        return acc + (product.quantity * product.price);
      }, 0);

      console.log("-----------------totalOrder", totalOrder)

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          "Discount requires a minimum order value of",
          discount_min_order_value
        );
      }
    }

    if (discount_limit_uses > 0) {
      const userUseDiscount = discount_users_used.find(user => user.userId === userId);
      if (userUseDiscount) { }
    }

    const amount = discount_type === 'fix_amount' ? discount_value : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }


  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: shopId
    })

    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      }
    });

    if (!foundDiscount) throw new NotFoundError(`Discount not found`);

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    });

    return result;
  }
}


module.exports = DiscountService