"use strict";

const { testConnectionRabbitMQ } = require("../db/init.rabbitmq");

describe("RabbitMQ connection", () => {
  it("should connect to successfull rabbitMQ", async () => {
    const result = await testConnectionRabbitMQ();
    expect(result).toBeUndefined();
  });
});
