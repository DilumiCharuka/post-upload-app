const Comment = require('../models/Comment');
const Post = require('../models/Post');

const commentController = {
  getCommentsByPost: async (req, res) => {
    try {
      const [rows] = await Comment.findByPostId(req.params.postId);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createComment: async (req, res) => {
    try {
      const { postId, content } = req.body;
      const userId = req.user.id;
      const [result] = await Comment.create(userId, postId, content);
      res.json({ id: result.insertId, postId, content, userId });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateComment: async (req, res) => {
    try {
      const [rows] = await Comment.findById(req.params.id);
      if (rows.length === 0) return res.status(404).json({ message: 'Comment not found' });

      const comment = rows[0];
      const [postRows] = await Post.findById(comment.post_id);
      const post = postRows[0];

      // Allow admin or post owner
      if (post.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not allowed' });
      }

      await Comment.update(req.params.id, req.body.content);
      res.json({ message: 'Comment updated' });
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const [rows] = await Comment.findById(req.params.id);
      if (rows.length === 0) return res.status(404).json({ message: 'Comment not found' });

      const comment = rows[0];
      const [postRows] = await Post.findById(comment.post_id);
      const post = postRows[0];

      // Allow admin or post owner
      if (post.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not allowed' });
      }

      await Comment.delete(req.params.id);
      res.json({ message: 'Comment deleted' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = commentController;
