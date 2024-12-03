"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtil");
const router = express.Router();

// Login
router.post("/shop/login", asyncHandler(accessController.login));

// Sign Up
router.post("/shop/signup", asyncHandler(accessController.signUp));

// authentication
router.use(authentication);

router.post("/shop/logout", asyncHandler(accessController.logout));

module.exports = router;
