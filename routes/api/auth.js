const express = require("express");
const router = express.Router();
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const authMiddleWare = require("../../middleware/auth");

const User = require("../../models/User");

/**
 * @route       GET api/auth
 * @desc        Test route
 * @access      Public
 */
router.get("/", authMiddleWare, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.msg);
    res.status(500).send("Internal server error.");
  }
});

/**
 * @route       POST api/users
 * @desc        Authenticate user and get token
 * @access      Public
 */
router.post(
  "/",
  [
    check("email", "Please enter a valid email.").isEmail(),
    check("password", "Password is required.").exists()
  ],
  async (req, res) => {
    // cast the err object from the inflow request
    const errors = validationResult(req);
    // check if there is error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructure the request body
    // Note: the password extracted here is the plain text password
    // input by user
    const { email, password } = req.body;

    try {
      // see if the user has already existed (recall unique email)
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid credentials. No user found."
            }
          ]
        });
      }
      // NOTE: the 1st parameter here is the plain text password
      // the 2nd parameter is the password field of the user fetched from DB.
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid credentials. No user found."
            }
          ]
        });
      }

      // return jsonwebtoken => in the front-end, user is logged in right way after registration
      // create a payload
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get("jwtsecret"),
        { expiresIn: 72000000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal server error.");
    }
  }
);

module.exports = router;
