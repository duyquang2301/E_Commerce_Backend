const express = require("express");
const app = express();
const { v4: uuidv4 } = require('uuid');
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const { checkOverload } = require("./v1/helpers/check.connect");
const myLogger = require("./v1/loggers/logger")

// test redis
// const productTest = require("./v1/test/product.test");
// productTest.purchaseProduct("product::001", 10)
// require("./v1/test/inventory.test")
// checkOverload();
//init dbs
require("./v1/databases/init.mongodb");
// require('./v1/databases/init.redis')

// ioredis
const ioredis = require('./v1/databases/init.ioredis')
ioredis.init({
  IOREDIS_HOST_ENABLED: true
})
//user middleware
app.use(helmet());
app.use(morgan("combined"));
// compress responses
app.use(compression());

// add body-parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"];
  req.requestId = requestId ? requestId : uuidv4();
  myLogger.log(`input params:::${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === 'POST' ? req.body : req.query
  ])
  next();
});

//router
app.use(require("./v1/routes/index.router"));

// Error Handling Middleware called

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
  const resMessage = `${error.status} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`;
  myLogger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    {
      message: error.message,
    }
  ])

  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
      // stack: error.stack
    },
  });
});

module.exports = app;
