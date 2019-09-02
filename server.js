// makes express to look for an environment variable called "PORT"
// necessary for deployment environment like Heroku
// otherwise (in local host), use port 5000
const PORT = process.env.PORT || 5000;

const express = require("express");

const app = express();

app.get("/", (req, res) => res.send("API running..."));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
