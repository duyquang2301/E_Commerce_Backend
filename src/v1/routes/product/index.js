"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtil");
const productController = require("../../controllers/product.controller");
const router = express.Router();

// authentication
router.use(authenticationV2);

router.post("/", asyncHandler(productController.createProduct));
router.post("/publish/:id", asyncHandler(productController.publishProductByShop));

router.get("/draft/all", asyncHandler(productController.findAllDraftForShop))
router.get("/published/all", asyncHandler(productController.findAllPublishForShop))

module.exports = router;
