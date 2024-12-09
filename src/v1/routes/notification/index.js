"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtil");
const commentController = require("../../controllers/comment.controller");
const notificationController = require("../../controllers/notification.controller");
const router = express.Router();


// authentication
router.use(authenticationV2);

router.get("/", asyncHandler(notificationController.ListNotificationByUser))

module.exports = router;
