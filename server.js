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

// init middleware
// body parser is now included within express => use it to access body of post request
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running..."));

// bring in the routers
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
