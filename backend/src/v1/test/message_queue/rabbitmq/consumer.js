const amqp = require("amqplib")


const runConsumer = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queueName = 'test-topic';
    await channel.assertQueue(queueName, {
      durable: true
    });


    // send message
    channel.consume(queueName, (messages) => {
      console.log(`Received Message Queue::: ${messages.content.toString()}`);
    }, {
      noAck: true
    });
  } catch (error) {
    console.error(error);
  }
}

runConsumer().catch(console.error)