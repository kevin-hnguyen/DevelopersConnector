// make express to look for an environment variable called "PORT"
// necessary for deployment environment like Heroku
// otherwise (in local host), use port 5000
const PORT = process.env.PORT || 5000;

// fetch the asynchronous function "connectDB" from "db.js"
const connectDB = require("./config/db");

const express = require("express");

const app = express();

// connect to mongo database
connectDB();

app.get("/", (req, res) => res.send("API running..."));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
