"use strict";

const { getIORedis } = require("../../databases/init.ioredis");

const getRedisClient = () => {
  const redisClient = getIORedis().instanceConnect;
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }
  return redisClient;
};

const setCacheIO = async ({ key, value }) => {
  const redisClient = getRedisClient();
  try {
    return await redisClient.set(key, value);
  } catch (error) {
    console.error(`Error setting key "${key}" in Redis: ${error.message}`);
    throw new Error(`Failed to set cache: ${error.message}`);
  }
};

const setCacheIOExpiration = async ({ key, value, expirationSeconds }) => {
  const redisClient = getRedisClient();
  try {
    return await redisClient.set(key, value, "EX", expirationSeconds);
  } catch (error) {
    console.error(
      `Error setting key "${key}" with expiration in Redis: ${error.message}`
    );
    throw new Error(`Failed to set cache with expiration: ${error.message}`);
  }
};

const getCacheIO = async ({ key }) => {
  const redisClient = getRedisClient();
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error(`Error getting key "${key}" from Redis: ${error.message}`);
    throw new Error(`Failed to get cache: ${error.message}`);
  }
};

module.exports = {
  setCacheIO,
  setCacheIOExpiration,
  getCacheIO,
};
