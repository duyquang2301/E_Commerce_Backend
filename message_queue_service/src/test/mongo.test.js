const mongoose = require("mongoose");

const stringConnection = "mongodb://localhost:27017/shopDEV";

const testSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("Test", testSchema);

describe("Mongosee connection", () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(stringConnection);
  });

  afterAll(async () => {
    if (connection) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  });

  it("should connect to mongoose", async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("should save a document to the database", async () => {
    const user = new Test({ name: "User" });
    await user.save();

    expect(user.isNew).toBe(false);
  });

  it("should find a document to the database", async () => {
    const user = await Test.findOne({ name: "User" });
    expect(user).toBeDefined();
    expect(user.name).toBe("User");
  });
});
