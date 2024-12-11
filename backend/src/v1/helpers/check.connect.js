"use strict";

const mongose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECOND = 5000;

// count connection
const countConnect = () => {
  const numberConnection = mongose.connect.length;
  console.log(`Number of connections:::${numberConnection}`);
};

// Check overload connection
const checkOverload = () => {
  setInterval(() => {
    const numberConnection = mongose.connect.length;
    const numberCore = os.cpus().length;
    const memeryUsage = process.memoryUsage().rss;
    const maxConnection = numberCore * 5;

    console.log(`Active Connection::: ${numberConnection}`);
    console.log(`Memory Usage::: ${memeryUsage / 1024 / 1024} MB`);

    if (numberConnection > maxConnection) {
      console.log(`Connection overload detected`);
    }
  }, _SECOND); // monitor every 5s
};

module.exports = {
  countConnect,
  checkOverload,
};
