const redisPushService = require("../services/redis.push.service");

class InventoryServiceTest {
  constructor() {
    redisPushService.subscribe('purchase_events', (channel, message) => {
      console.log(`Message received on channel ${channel}: ${message}`);
      try {
        const { productId, quantity } = JSON.parse(message);
        InventoryServiceTest.updateInventory(productId, quantity);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });
  }

  static updateInventory(productId, quantity) {
    console.log(`Update inventory for product ID: ${productId} with quantity: ${quantity}`);
  }
}

module.exports = new InventoryServiceTest()