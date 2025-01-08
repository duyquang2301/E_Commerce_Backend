const Redis = require("ioredis");
const { ErrorResponse } = require("../core/error.response");

let clients = {};
let connectTimeout;

const REDIS_CONNECT_TIMEOUT = 10000;
const REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: "Server connection to Redis failed.",
};

const statusConnectRedis = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconnecting",
  ERROR: "error",
};

const handleTimeoutError = () => {
  connectTimeout = setTimeout(() => {
    throw new ErrorResponse({
      message: REDIS_CONNECT_MESSAGE.message,
      statusCode: REDIS_CONNECT_MESSAGE.code,
    });
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnection = (connectionRedis) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log("Redis - Connection status: connected");
    clearTimeout(connectTimeout);
  });

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log("Redis - Connection status: disconnected");
    handleTimeoutError();
  });

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log("Redis - Connection status: reconnecting...");
  });

  connectionRedis.on(statusConnectRedis.ERROR, (error) => {
    console.error("Redis - Connection error:", error);
    handleTimeoutError();
  });
};

const init = ({
  IOREDIS_HOST_ENABLED = true,
  IOREDIS_HOST = process.env.REDIS_CACHE_HOST || "127.0.0.1",
  IOREDIS_PORT = 6379,
}) => {
  if (IOREDIS_HOST_ENABLED) {
    console.log(
      `Initializing Redis connection to ${IOREDIS_HOST}:${IOREDIS_PORT}`
    );

    const instanceRedis = new Redis({
      host: IOREDIS_HOST,
      port: IOREDIS_PORT,
      retryStrategy: (times) => {
        console.warn(`Redis retry attempt #${times}`);
        return Math.min(times * 50, 2000); // Retry every 50ms, max 2s
      },
      connectTimeout: REDIS_CONNECT_TIMEOUT,
    });

    clients.instanceConnect = instanceRedis;
    handleEventConnection(instanceRedis);

    // Add timeout error handling during initialization
    handleTimeoutError();
  } else {
    console.warn("Redis connection is disabled.");
  }
};

const getIORedis = () => clients;

const closeRedis = async () => {
  if (clients.instanceConnect) {
    console.log("Closing Redis connection...");
    await clients.instanceConnect.quit();
    clients.instanceConnect = null;
  } else {
    console.warn("No Redis connection to close.");
  }
};

module.exports = {
  init,
  getIORedis,
  closeRedis,
};
