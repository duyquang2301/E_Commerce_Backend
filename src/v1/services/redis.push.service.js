const { createClient } = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscriber = createClient();
    this.publisher = createClient();

    // Connect both publisher and subscriber
    this.subscriber.connect().catch((err) => console.error("Subscriber Error:", err));
    this.publisher.connect().catch((err) => console.error("Publisher Error:", err));
  }

  async publish(channel, message) {
    try {
      const reply = await this.publisher.publish(channel, message);
      return reply;
    } catch (err) {
      console.error("Publish Error:", err);
      throw err;
    }
  }

  async subscribe(channel, callback) {
    try {
      await this.subscriber.subscribe(channel, (message) => {
        callback(channel, message);
      });
    } catch (err) {
      console.error("Subscribe Error:", err);
      throw err;
    }
  }
}

module.exports = new RedisPubSubService();
