"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2 } = require("../../auth/authUtil");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");
const router = express.Router();

// authentication
// router.use(authenticationV2);

router.post("/product/upload", asyncHandler(uploadController.uploadFile));
router.post(
  "/product/upload/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileThumb)
);

router.post(
  "/product/upload/bucket",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadFileToS3)
);

module.exports = router;
