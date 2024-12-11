"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtil");
const commentController = require("../../controllers/comment.controller");
const router = express.Router();


// authentication
router.use(authenticationV2);

router.post("/", asyncHandler(commentController.createComment))
router.get("/", asyncHandler(commentController.findComments))
router.delete("/", asyncHandler(commentController.deleteComment))

module.exports = router;
