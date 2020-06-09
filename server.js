// fetch the asynchronous function "connectDB" from "db.js"
const connectDB = require("./config/db");

const express = require("express");

const path = require("path");

const app = express();

// connect to mongo database
connectDB();

// init middleware
// body parser is now included within express => use it to access body of post request
app.use(express.json({ extended: false }));

// app.get("/", (req, res) => res.send("API running..."));

// bring in the routers
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// Serve static asset in production
if (process.env.NODE_ENV === "production") {
  // Specify static assets folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
  });
}

// make express to look for an environment variable called "PORT"
// necessary for deployment environment like Heroku
// otherwise (in local host), use port 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
