"use strict";

const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("../models/repository/inventory.repository");

// Initialize Redis client
const redisClient = redis.createClient();
redisClient.on("error", (err) => console.error("Redis Error:", err));

// Promisify Redis commands
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

const acquired = async (productId, quantity, cartId) => {
    const key = `lock_v2024_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; // milliseconds

    for (let i = 0; i < retryTimes; i++) {
        // Attempt to acquire lock
        const result = await setAsync(key, cartId, "NX", "PX", expireTime);
        if (result === "OK") {
            try {
                // Handle inventory reservation
                const isReservation = await reservationInventory({ productId, quantity, cartId });
                if (isReservation.modifiedCount) {
                    return key; // Lock acquired and inventory updated
                } else {
                    await releaseLock(key); // Release lock if inventory update fails
                    return null;
                }
            } catch (err) {
                console.error("Error during reservation:", err);
                await releaseLock(key);
                return null;
            }
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 50));
    }

    return null; // Lock not acquired
};

const releaseLock = async (keyLock) => {
    return await delAsync(keyLock);
};

module.exports = {
    acquired,
    releaseLock,
};
