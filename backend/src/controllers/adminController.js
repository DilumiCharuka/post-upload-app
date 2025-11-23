const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const [users] = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.delete(id); // We'll add delete in model
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.delete(id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await Comment.delete(id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
