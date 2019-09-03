const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authMiddleWare = require("../../middleware/auth");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

/**
 * Given a token, displays a profile.
 * This route allows user to edit his information => protected route.
 * @route       GET api/profile/me
 * @desc        Get current user profile
 * @access      Private
 */
router.get("/me", authMiddleWare, async (req, res) => {
  try {
    // recall: 1. a Profile object has a field "user" that refers to id of a user
    // 2. in the token, we attach the user.id to the request.
    // what is about the populate()? The avatar and name of an user is pertained to the user
    // not the profile => if we want to bring those fields in, use the populate()
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    // check if there is a profile
    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user." });
    }
    res.json({ profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error.");
  }
});

/**
 * A route to let logged in/verified user create or update his profile
 * @route       POST api/profile/
 * @desc        Post the form to create/update user to server
 * @access      Private
 */
router.post(
  "/",
  [
    authMiddleWare,
    [
      check("status", "Status is required.")
        .not()
        .isEmpty(),
      check("skills", "Skills are required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;
    // build profile fields, start with an empty object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }
    // build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    // done with building, now go on to create or update DB
    try {
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal server error");
    }
  } // end of the arrow function
);

module.exports = router;
