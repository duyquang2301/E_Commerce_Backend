"use strict";

const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("../models/repository/inventory.repository");
const redisClient = redis.RedisClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquired = async (productId, quantity, cartId) => {
    const key = `lock_v2024_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTimes.length; i++) {
        const result = await setnxAsync(key, expireTime);
        console.log(`results::::`, result);

        if (result === 1) {
            // hanlde inventory
            const isReservation = await reservationInventory({ productId, quantity, cartId });
            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
};

const releaseLock = async (keyLock) => {
    const deleteKey = promisify(redisClient.del).bind(redisClient);
    return await deleteKey(keyLock);
};

module.exports = {
    acquired,
    releaseLock,
};
