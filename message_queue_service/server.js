"use strict";

const { consumerToQueue } = require("./src/service/consumerQueue.service");

const queueName = "test-topic";

consumerToQueue(queueName)
  .then(() => {
    console.log(`Message Queue:::${queueName}`);
  })
  .catch((error) => {
    console.log("ERROR", error);
  });
