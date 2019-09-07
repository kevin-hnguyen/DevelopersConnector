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

/**
 * @route       GET api/posts
 * @desc        Get all posts
 * @access      Private
 */
router.get("/", authMiddleWare, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server error.");
  }
});

/**
 * @route       GET api/posts/:id
 * @desc        Get post given an ID
 * @access      Private
 */
router.get("/:id", authMiddleWare, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // the id passed as parameter may be invalid
    if (!post) {
      return res.status(404).json({ msg: "Post not found." });
    }
    res.json(post);
  } catch (err) {
    console.log(err.message);
    // the id passed as parameter may be invalid
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found." });
    }
    res.status(500).send("Internal Server error.");
  }
});

/**
 * @route       DELETE api/posts/:id
 * @desc        Delete a post with a particular ID
 * @access      Private
 */
router.delete("/:id", authMiddleWare, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found." });
    }
    // ensure that the user making the DELETE request must be the owner of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized." });
    }
    await post.remove();
    res.json({ msg: "Post removed." });
  } catch (err) {
    console.log(err.message);
    // the id passed as parameter may be invalid
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found." });
    }
    res.status(500).send("Internal Server error.");
  }
});

/**
 * @route       PUT api/posts/like/:id
 * @desc        Like a post with a particular ID
 * @access      Private
 */
router.put("/like/:id", authMiddleWare, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // check if the current authorized user has already liked the current post
    // we do not want him to like multiple times
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: "This user has liked this post before." });
    }
    // if everything is fine, then attach the user to likes array of the post
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server error.");
  }
})

/**
 * @route       PUT api/posts/unlike/:id
 * @desc        Unlike a post with a particular ID
 * @access      Private
 */
router.put("/unlike/:id", authMiddleWare, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // check if the current authorized user has NOT liked the current post yet
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: "This user has liked this post before." });
    }
    // if everything is fine
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server error.");
  }
})

module.exports = router;
