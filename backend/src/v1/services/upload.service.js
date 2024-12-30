"use strict";

const { PutObjectCommand, s3 } = require("../configs/s3.config");
const cloudinary = require("../configs/cloudinary.config");

const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      "https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75";
    const folderName = "product/shopId",
      newFile = "testdemo";

    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFile,
      folder: folderName,
    });

    return result;
  } catch (error) {
    console.error("Error uploading image:::", error);
  }
};

const uploadSingleImage = async ({ path, folderName = "product/8049" }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: "thumb",
      folder: folderName,
    });
    return {
      image_url: result.secure_url,
      shopId: 8409,
    };
  } catch (error) {
    console.error("Error uploading image:::", error);
  }
};

/// aws
const uploadImageToS3Bucket = async ({ file }) => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    const result = await s3.send(command);
    console.log("Upload successful:", result);

    return result;
  } catch (error) {
    console.error("Error uploading image:::", error.message);
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadSingleImage,
  uploadImageToS3Bucket,
};
