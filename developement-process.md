#### 2.1 MongoDB Atlas setup
Create a cluster with free-tier for development. Rename the cluster (otherwise, its name is Cluter0 by default).
Add an user and set his privileges (admin or read/write).
Configure network access (access from any machine => 0.0.0.0 or access from current machine (exact IP) only).

#### 2.2 Install dependencies and set up Express app
Create .gitignore file and write "node_modules/" to ignore the whole folder "node_modules".
Use command git init to make our folder a git directory.
Use "npm install" to use those packages:
* express
* express-validator
* bcryptjs to store passwords encrypted
* config to create global contants/literals/values to use throughout app
* gravatar
* jsonwebtoken
* mongoose
* request
For the development process, use
* nodemon
* concurrently to run front-end React and back-end Express at the same time
with command `npm install -D`.
Create server.js file.
Declare a variable "PORT" that can either be environment.PORT variable (in those deployment environment like Heroku) or be 5000/whatever (in local machine).
Bring in basic code to get the back-end server running
```
// File: server.js
const PORT = process.env.PORT || 5000;

const express = require("express");

const app = express();

app.get("/", (req, res) => res.send("API running..."));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
```
Create 2 scripts
```
// File: package.json
"scripts": {
    "start": "node server.js",
    "server": "nodemon server.js"
  },
```
So from now on, to fire up the server, simply use `npm run server` (more meaningful than `nodemon`).
Install Postman to test API endpoints.
End of each working session, remember to commit changes to git.
```
git add .
git commit -m "...your message..."
```
#### 2.3 Connect to MongoDB with mongoose
Go to the MongoDB Atlas page to get the connection string like `mongodb+srv://hai:<password>@devconnector-hkbyq.mongodb.net/test?retryWrites=true&w=majority`.
Back to working directory, create a folder `config` and two files `db.js` and `default.json`. Recall the package `config` installed earlier? It is used to read the `default.json` file in `config` folder.
We store the mongo URI (connection string) in `default.json` as follows
```
{
  "mongoURI": "mongodb+srv://hai:hai@devconnector-hkbyq.mongodb.net/test?retryWrites=true&w=majority"
}
```
Inside `db.js`, here is the code to connect to database:
```
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
```
All the code connecting to database are implemented here, to avoid cluterring the main `server.js` file.
Inside the `server.js` file, bring in the `connectDB` function and invoke it.
```
// fetch the asynchronous function "connectDB" from "db.js"
const connectDB = require("./config/db");

// connect to mongo database
connectDB();
```
Run command `npm run server` to test connection.
Commit changes to git.
#### 2.4 Create route files for different routes
Inside the root, create a folder `routes`. Inside of it, create another folder `api`. Inside `api`, create 4 files to deal with routing `users.js`, `auth.js`, `posts.js` and `profile.js`.
This is what is inside `users.js`:
```
const express = require("express");
const router = express.Router();

/**
 * @route       GET api/users
 * @desc        Test route
 * @access      Public
 */
router.get("/", (req, res) => res.send("Users router"));

module.exports = router;
```
At this point, we just create a dummy route to test only.
Back to `server.js`, we handle the users route to the `users.js` file with
```
// bring in the routers
app.use("/api/users", require("./routes/api/users"));
```
Pay close attention. The method here is `use` not `get`.
Do the same thing for three other routes.
We now can test the API endpoints with Postman: `localhost:5000/api/{users, auth, posts, profile}`