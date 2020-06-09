const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

//@rount    POST api/posts
//@desc     Create post
//@access   private
router.post(
  '/',
  [auth, [check('text', 'Text is requried').not().isEmpty()]],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);
//@rount    GET api/posts
//@desc     Get all posts
//@access   private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

//@rount    GET api/posts/:id
//@desc     Get a single post
//@access   private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post Not Found');
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    if (error.kind == 'ObjectId') {
      res.status(404).send('Post Not Found');
    }
    res.status(500).send('Server error');
  }
});

//@rount    DELETE api/posts/:id
//@desc     delete a post
//@access   private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post Not Found');
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user not authorized' });
    }
    await post.remove();
    res.json({ msg: 'post removed' });
  } catch (error) {
    console.error(error);
    if (error.kind == 'ObjectId') {
      res.status(404).send('Post Not Found');
    }
    res.status(500).send('Server error');
  }
});

//@rount    PUT api/posts/like/:id
//@desc     like a post
//@access   private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post Not Found');
    }
    //check if the post already liked by the user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

//@rount    PUT api/posts/unlike/:id
//@desc     unlike a post
//@access   private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post Not Found');
    }
    //check if the post already liked by the user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    //get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

//@rount    POST api/posts/comment/:id
//@desc     comment on a post
//@access   private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is requried').not().isEmpty()]],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();

      //save a new notification
      const newNo = new Notification({
        text: 'commented on your post',
        type: 'comment',
        post: post.id,
        postText: post.text,
        receiveUser: post.user,
        fromUser: req.user.id,
        fromUserName: user.name,
      });
      await newNo.save();
      res.json(post.comments);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);

//@rount    POST api/posts/comment/:id/:comment_id
//@desc     delete comment
//@access   private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    //check comment
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not exists' });
    }
    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    post.comments = post.comments.filter(
      (comment) => comment.id !== req.params.comment_id
    );
    console.log(post.comments);
    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
module.exports = router;
