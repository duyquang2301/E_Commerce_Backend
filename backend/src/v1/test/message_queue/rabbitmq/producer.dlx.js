const amqp = require("amqplib");

const messages = "AMQL rabbitmq introduce";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const notificationExchange = "notification_exchange";
    const notificationQueue = "notification_queue";
    const notificationExchangeDLX = "notification_exchange_DLX";
    const notificationRoutingKeyDLX = "notification_routing_key_DLX";

    // create exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // create queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // bind queue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // send message
    const msg = "new product";
    console.log(`producer msg:: ${msg}`);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "2000",
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error(error);
  }
};

runProducer()
  .then((rs) => console.log(rs))
  .catch(console.error);
