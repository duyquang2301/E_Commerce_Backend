"use strict";

const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    if (!connection) throw new Error("Connection RabbitMQ Failed");

    const channel = await connection.createChannel();

    return { channel, connection };
  } catch (error) {}
};

const testConnectionRabbitMQ = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();

    const queue = "test-queue";
    const message = "Hello, shop by test";

    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(message));

    await connection.close();
  } catch (error) {
    console.error(error);
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log("Waiting for message........");
    channel.consume(
      queueName,
      (msg) => {
        console.log(
          `Received message::: ${queueName}::`,
          msg.content.toString()
        );
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error("error ", error);
    throw error;
  }
};

module.exports = {
  connectToRabbitMQ,
  testConnectionRabbitMQ,
  consumerQueue,
};
