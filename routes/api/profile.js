const express = require("express");
const router = express.Router();
const request = require("request"); // comes to play for the github endpoint
const config = require("config");
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

/**
 * A route to display all available profiles.
 * @route       GET api/profile
 * @desc        Get all profiles in db, all fetch username and avatar from User model too
 * @access      Public
 */

router.get("/", async (req, res) => {
  try {
    // Note: in the "models/User.js", we export the model as "users": module.exports = User = mongoose.model("users", UserSchema);
    // However, in the "models/Profile.js", we define a profile to have a property call "user"
    // the method populate() is called to insert into the field "user" of a profile several more properties!
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error");
  }
});

/**
 * @route       GET api/profile/user/:user_id
 * @desc        Get a profile of an user given his user id
 * @access      Public
 */

router.get("/user/:user_id", async (req, res) => {
  try {
    // Note: in the "models/User.js", we export the model as "users": module.exports = User = mongoose.model("users", UserSchema);
    // However, in the "models/Profile.js", we define a profile to have a property call "user"
    // the method populate() is called to insert into the field "user" of a profile several more properties!
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found." });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    // sometimes, the parameter :user_id is not a valid user ID, it is not the server's fault
    // we should separate those 2 types of errors
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile not found." });
    }
    res.status(500).send("Internal server error");
  }
});

/**
 * @route       DELETE api/profile
 * @desc        Delete profile, user and all corresponding posts of the user
 * @access      Private
 */

router.delete("/", authMiddleWare, async (req, res) => {
  try {
    // remove user's posts

    // remove the profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // remove the user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User removed." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error");
  }
});

/**
 * @route       PUT api/profile/experience
 * @desc        Add profile experience
 * @access      Private
 */
router.put(
  "/experience",
  [
    authMiddleWare,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @route       DELETE api/profile/experience/:exp_id
 * @desc        Delete experience from profile
 * @access      Private
 */
router.delete("/experience/:exp_id", authMiddleWare, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  "/education",
  [
    authMiddleWare,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete an education entry from education
// @access   Private
router.delete("/education/:edu_id", authMiddleWare, async (req, res) => {
  try {
    const foundProfile = await Profile.findOne({ user: req.user.id });
    const eduIds = foundProfile.education.map(edu => edu._id.toString());
    const removeIndex = eduIds.indexOf(req.params.edu_id);
    if (removeIndex === -1) {
      return res.status(500).json({ msg: "Server error" });
    } else {
      foundProfile.education.splice(removeIndex, 1);
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route    GET api/profile/github/:username
// @desc     Get/display user repository from Github
// @access   Public
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
        }/repos?per_page=5&sort=created:asc&client_id=${config.get(
          "githubClientId"
        )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: {
        "user-agent": "node.js"
      }
    };
    request(options, (error, response, body) => {
      if (error) console.log(error);
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Gihub profile found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
