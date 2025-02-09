"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const {
  uploadImageFromUrl,
  uploadSingleImage,
  uploadImageToS3Bucket,
} = require("../services/upload.service");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: "upload successfully image",
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("file missing");
    }
    new SuccessResponse({
      message: "upload successfully image",
      metadata: await uploadSingleImage({ path: file.path }),
    }).send(res);
  };

  uploadFileToS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("file missing");
    }
    new SuccessResponse({
      message: "upload successfully image to s3 bucket",
      metadata: await uploadImageToS3Bucket({ file }),
    }).send(res);
  };
}

module.exports = new UploadController();
