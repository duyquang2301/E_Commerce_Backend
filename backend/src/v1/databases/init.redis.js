const redis = require('redis');
const { ErrorResponse } = require('../core/error.response');


let client = {}, statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}, connectTimeout



const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: 'Server connect redis',
}

const handleTimeoutError = () => {
    connectTimeout = setTimeout(() => {
        throw new ErrorResponse({
            message: REDIS_CONNECT_MESSAGE.message,
            statusCode: REDIS_CONNECT_MESSAGE.code
        })
    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = ({ connectionRedis }) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('connectionRedis - Connection status: connected');
        clearTimeout(connectTimeout)
    });

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('connectionRedis - Connection status: disconnected');
        handleTimeoutError()
    });
}

const initRedis = () => {
    const instanceRedis = redis.createClient()
    client.instanceConnect = instanceRedis
    handleEventConnection({ connectionRedis: instanceRedis })
}

const getRedis = () => client


const closeRedis = () => { }

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}