const mongoose = require("mongodb");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("Connected to database");
  } catch (error) {
    console.error(error.message);
    // Exit process if could not connect to database
    process.exit(1);
  }
};

module.exports = connectDB;
