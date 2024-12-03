"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens ? tokens.publicKey : null;

      const field = { user: userId }, update = {
        publicKey, privateKey, refreshTokenUsed: [], refreshToken
      }, options = { upsert: true, new: true };

      const token = await keyTokenModel.findOneAndUpdate(field, update, options);

      return token ? token.publicKey : null;

    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
