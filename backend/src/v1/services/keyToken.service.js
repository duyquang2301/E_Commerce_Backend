"use strict";

const keyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens ? tokens.publicKey : null;

      const field = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const token = await keyTokenModel.findOneAndUpdate(
        field,
        update,
        options
      );

      return token ? token.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: Types.ObjectId(userId) });
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.remove(id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken });
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: Types.ObjectId(userId) });
  };
}

module.exports = KeyTokenService;
