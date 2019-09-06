const express = require("express");
const router = express.Router();
const authMiddleWare = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

/**
 * @route       POST api/posts
 * @desc        Create a new post
 * @access      Private
 */
router.post(
  "/",
  [
    authMiddleWare,
    [
      check("text", "Text is required.")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // extract this for the "name" and "avatar" fields only
    const user = User.findById(req.user.id).select("-password");
    const newPost = new Post({
      text: req.body.text,
      user: req.user.id,
      name: user.name,
      avatar: user.avatar
    });
    const post = await newPost.save();
    res.json(post);
  } // end
);

module.exports = router;
