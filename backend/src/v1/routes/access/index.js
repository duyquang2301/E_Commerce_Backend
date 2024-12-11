"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtil");
const router = express.Router();

// Login
router.post("/shop/login", asyncHandler(accessController.login));

// Sign Up
router.post("/shop/signup", asyncHandler(accessController.signUp));

// authentication
router.use(authenticationV2);

router.post("/shop/logout", asyncHandler(accessController.logout));
router.post("/shop/handlerRefreshToken", asyncHandler(accessController.handlerRefreshToken));

module.exports = router;
