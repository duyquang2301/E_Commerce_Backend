"use strict";
const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rf-token"
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // verify token
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verifying token`, err);
      } else {
        console.log(`Token verified successfully`, decode);
      }
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) { }
};

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Error: Unauthorized");
  }

  const keyStore = await KeyTokenService.findByUserId(userId);
  console.log("--------------------", keyStore)
  if (!keyStore) {
    throw new NotFoundError("Error: Key not found");
  }

  const refreshToken = req.headers[HEADER.REFRESHTOKEN];
  if (refreshToken) {
    try {
      console.log("refreshToken-------------", refreshToken)
      const decode = await JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decode.userId) throw new AuthFailureError("Error: Invalid UserId");
      req.keyStore = keyStore;
      req.user = decode;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Error: Unauthorized");
  }

  try {
    const decode = await JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decode.userId)
      throw new AuthFailureError("Error: Invalid UserId");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Error: Unauthorized");
  }

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Error: Key not found");
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Error: Unauthorized");
  }

  try {
    const decode = await JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decode.userId)
      throw new AuthFailureError("Error: Invalid UserId");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifiedJWT = async (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifiedJWT,
};
