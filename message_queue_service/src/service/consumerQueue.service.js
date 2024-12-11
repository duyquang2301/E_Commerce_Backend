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

  // case normal
  consumerToQueueNormal: async () => {
    try {
      const { channel } = await connectToRabbitMQ();
      const notificationQueue = "notification_queue";

      const expiredTime = 5000;

      // setTimeout(() => {
      //   channel.consume(notificationQueue, (msg) => {
      //     console.log(
      //       "SEND notification successfully processed",
      //       msg.content.toString()
      //     );
      //     channel.ack(msg); // Acknowledge message
      //   });
      // }, expiredTime);

      channel.consume(notificationQueue, (msg) => {
        try {
          const numberTest = Math.random();
          console.log({ numberTest });

          if (numberTest < 0.8) {
            throw new Error("SEND notification failed:: HOTFIX");
          }
          console.log(
            "SEND notification successfully processed",
            msg.content.toString()
          );
          channel.ack(msg); // Acknowledge message
        } catch (error) {
          // console.log("Error", error);
          channel.nack(msg, false, false);
        }
      });
    } catch (error) {
      console.error("Error in consumerToQueueNormal:", error);
      throw error;
    }
  },

  // case falied
  consumerToQueueFailed: async () => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notificationExchangeDLX = "notification_exchange_DLX";
      const notificationRoutingKeyDLX = "notification_routing_key_DLX";

      const notificationQueuehanler = "notification_queue_handler_hotfix";

      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notificationQueuehanler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );

      await channel.consume(
        queueResult.queue,
        (msgFailed) => {
          console.log(
            `this notification error:: hotfix`,
            msgFailed.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  },
};

module.exports = messaegService;
