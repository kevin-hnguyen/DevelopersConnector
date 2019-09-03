const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
// https://express-validator.github.io/docs/
const { check, validationResult } = require("express-validator");

// bring in User model
const User = require("../../models/User");

/**
 * @route       POST api/users
 * @desc        Register user
 * @access      Public
 */
router.post(
  "/",
  [
    check("name", "Name is required.")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email.").isEmail(),
    check(
      "password",
      "Please enter a password with at least 6 characters."
    ).isLength({
      min: 6
    })
  ],
  async (req, res) => {
    // cast the err object from the inflow request
    const errors = validationResult(req);
    // check if there is error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructure the request body
    const { name, email, password } = req.body;

    try {
      // see if the user has already existed (recall unique email)
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: "User already exists."
            }
          ]
        });
      }
      // get user's gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      // create a new User instance
      user = new User({
        name,
        email,
        avatar,
        password
      });
      // create a salt
      const salt = await bcrypt.genSalt(10);
      // encrypt password
      user.password = await bcrypt.hash(password, salt);
      //   save user to db
      await user.save();
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
