"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtil");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();


// get amount discount
router.post("/amount", asyncHandler(discountController.findDiscountAmount))
router.get("/list_product_code", asyncHandler(discountController.findDiscountCodeByProduct))

// authentication
router.use(authenticationV2);

router.post("/", asyncHandler(discountController.createDiscountCode))
router.get("/", asyncHandler(discountController.findDiscountCodeByShop))

module.exports = router;
