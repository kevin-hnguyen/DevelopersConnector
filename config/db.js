const mongoose = require("mongoose");

// config now can read the default.json file
const config = require("config");

// use "config" to fetch the connection string (uri) provided by Atlas
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    // since "connect" returns a promise => use keyword "await"
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    //   exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
