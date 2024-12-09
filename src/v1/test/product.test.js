const redisPushService = require("../services/redis.push.service")


class ProductServiceTest {
  async purchaseProduct(productId, quantity) {
    try {
      const order = { productId, quantity };
      const message = JSON.stringify(order);
      console.log("--------------", message)
      // Publish the purchase event
      const result = await redisPushService.publish("purchase_events", message);
      console.log(`Event published successfully. Result: ${result}`);
    } catch (error) {
      console.error("Error publishing purchase event:", error);
    }
  }
}

module.exports = new ProductServiceTest()