"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifiedJWT } = require("../auth/authUtil");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, Forbidden } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  // static handlerFresherToken = async (refreshToken) => {
  //   const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
  //   if (foundToken) {
  //     const { userId, email } = await verifiedJWT(
  //       refreshToken,
  //       foundToken.privateKey
  //     );
  //     console.log("--------[1]", { userId, email });
  //     await KeyTokenService.deleteKeyById(userId);
  //     throw new Forbidden("Something Wrong Happend !!! Plesse Relogin")
  //   }

  //   const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
  //   if (!holderToken) throw new AuthFailureError("Shop not registered");

  //   // verifyToken
  //   const { userId, email } = await verifiedJWT(refreshToken, holderToken.privateKey)
  //   console.log("--------[2]", { userId, email });

  //   const foundShop = await findByEmail({ email });
  //   if (!foundShop) throw new AuthFailureError("Shop not registered");
  //   const tokens = await createTokenPair({ userId: foundShop._id, email }, holderToken.publicKey, holderToken.privateKey);

  //   await holderToken.update({
  //     $set: {
  //       refreshToken: tokens.refreshToken,
  //     },
  //     $addToSet: {
  //       refreshTokenUsed: refreshToken
  //     }
  //   })

  //   return {
  //     user: { userId, email },
  //     tokens
  //   }
  // };

  static handlerFresherToken = async ({ refreshToken, user, keyStore }) => {
    console.log("object----------------", user)
    const { userId, email } = user;
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new Forbidden("Something Wrong Happend !!! Plesse Relogin")
    }

    if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError("Shop not registered");

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered");
    const tokens = await createTokenPair({ userId: foundShop._id, email }, keyStore.publicKey, keyStore.privateKey);

    await keyStore.update({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken
      }
    })

    return {
      user,
      tokens
    }
  };

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log("delKey-", delKey);
    return delKey;
  };

  static login = async ({ email, password }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Error: Shop not registered");
    }

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Error: Password not match");
    }

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: Create keyToken Failed!!");
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
  };
}

module.exports = AccessService;
