const mongoose = require("mongoose");
const {
  db: { name, port, host },
} = require("../configs/config.mongodb");

const connectionString = `mongodb://${host}:${port}/${name}`;
console.log("---connectionString", connectionString);

class Database {
  constructor() {
    this.connect();
  }

  // TODO using strategy pattern later
  connect(type = "mongodb") {
    // TODO replace by dev env later
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectionString)
      .then(() => console.log("Connected to mongoDB"))
      .catch((error) => {
        console.log("Error connect to DB");
      });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
