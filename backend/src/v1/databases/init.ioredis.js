const Redis = require('ioredis');
const { ErrorResponse } = require('../core/error.response');


let clients = {}, statusConnectRedis = {
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

const init = ({
    IOREDIS_HOST_ENABLED,
    IOREDIS_HOST = process.env.REDIS_CACHE_HOST,
    IOREDIS_PORT = 6379,
}) => {

    if (IOREDIS_HOST_ENABLED === true) {
        const instanceRedis = new Redis({
            host: IOREDIS_HOST,
            port: IOREDIS_PORT
        })
        clients.instanceConnect = instanceRedis
        handleEventConnection({ connectionRedis: instanceRedis })
    }

}

const getIORedis = () => clients


const closeRedis = () => { }

module.exports = {
    init,
    getIORedis,
    closeRedis
}