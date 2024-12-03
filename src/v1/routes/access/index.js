"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router();

// Login
router.post("/shop/login", asyncHandler(accessController.login));

// Sign Up
router.post("/shop/signup", asyncHandler(accessController.signUp));

module.exports = router;
