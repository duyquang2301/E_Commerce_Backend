const amqp = require("amqplib")

const messages = "AMQL rabbitmq introduce";


const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queueName = 'test-topic';
    await channel.assertQueue(queueName, {
      durable: true
    });


    // send message
    channel.sendToQueue(queueName, Buffer.from(messages));
    console.log("send message::::", messages);
  } catch (error) {
    console.error(error);
  }
}

runProducer().catch(console.error)