"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtil");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();


// authentication
router.use(authenticationV2);

router.post('/', asyncHandler(cartController.addToCart))
router.post('/update', asyncHandler(cartController.update))
router.delete('/', asyncHandler(cartController.delele))
router.get('/', asyncHandler(cartController.findUserCart))


module.exports = router;
