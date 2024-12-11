"use strict";

const { consumerQueue, connectToRabbitMQ } = require("../db/init.rabbitmq");

const messaegService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.log(`Error consumerQueue::`, error);
    }
  },
};

module.exports = messaegService;
