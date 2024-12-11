"use strict";

const {
  consumerToQueue,
  consumerToQueueNormal,
  consumerToQueueFailed,
} = require("./src/service/consumerQueue.service");

const queueName = "test-topic";

// consumerToQueue(queueName)
//   .then(() => {
//     console.log(`Message Queue:::${queueName}`);
//   })
//   .catch((error) => {
//     console.log("ERROR", error);
//   });

consumerToQueueNormal()
  .then(() => {
    console.log(`Message consumerToQueueNormal:::`);
  })
  .catch((error) => {
    console.log("ERROR", error);
  });

consumerToQueueFailed()
  .then(() => {
    console.log(`Message consumerToQueueFailed:::`);
  })
  .catch((error) => {
    console.log("ERROR", error);
  });
