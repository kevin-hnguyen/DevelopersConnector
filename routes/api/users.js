const express = require("express");
const router = express.Router();

// https://express-validator.github.io/docs/
const { check, validationResult } = require("express-validator/check");

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
  (req, res) => {
    // cast the err object from the inflow request
    const errors = validationResult(req);
    // check if there is error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // otherwise, everything is good
    res.send("Users router");
  }
);

module.exports = router;
