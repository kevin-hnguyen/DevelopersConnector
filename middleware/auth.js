/**
 * users wants to access a protected route.
 * He sends his request to the route.
 * Attached in the request is the json web token stored in the header of the request.
 * So, this middleware is responsible for testing the json token: it is present and
 * it is also valid so that the user is authorized.
 */
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, nextCallBack) {
  // extract the x-auth-token field from the header of the request
  const token = req.header("x-auth-token");
  // check if there is such token
  if (!token) {
    return res.status(401).json({
      msg: "No token found. Authorization denied."
    });
  }
  // check if the found token is valid+
  try {
    // in order to decode, we need to fetch the "jwtsecret" from "default.json"
    const decoded = jwt.verify(token, config.get("jwtsecret"));
    // recall in the payload. we attach the user
    req.user = decoded.user;
    // from here on, the request is attached with a new field, called "user"
    // any protected route can now access the req.user!
    // finally, call the next function
    nextCallBack();
  } catch (err) {
    res.status(401).json({
      msg: "Token is invalid. Authorization denied."
    });
  }
};
