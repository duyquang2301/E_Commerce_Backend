"use strict";

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Config = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};

const s3 = new S3Client(s3Config);

module.exports = {
  s3,
  PutObjectCommand,
};
