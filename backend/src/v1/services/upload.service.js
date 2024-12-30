"use strict";

const {
  PutObjectCommand,
  s3,
  GetObjectCommand,
} = require("../configs/s3.config");
const cloudinary = require("../configs/cloudinary.config");
const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `images/${Date.now()}-${file.originalname}`,
        Body: file.stream || file.buffer,
        ContentType: file.mimetype,
      },
    });

    upload.on("httpUploadProgress", (progress) => {
      console.log("Progress:", progress);
    });

    const result = await upload.done();
    console.log("Upload successful:", result);
    const signedUrlCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: result.Key,
    });
    const signedUrl = await getSignedUrl(s3, signedUrlCommand, {
      expiresIn: 3600,
    });
    console.log("Generated signed URL:", signedUrl);

    return signedUrl;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw new Error("Failed to upload image to S3.");
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadSingleImage,
  uploadImageToS3Bucket,
};
