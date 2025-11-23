
const Post = require('../models/Post');

// createPost now reads image from req.file
const postController = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.getAll();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getPostById: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });
      res.json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createPost: async (req, res) => {
    try {
      const { title, content } = req.body;
      const userId = req.user.id;
      const image = req.file ? req.file.filename : null; // read uploaded file

      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }

      const result = await Post.create(title, content, image, userId);

      res.status(201).json({
        id: result.insertId,
        title,
        content,
        image,
        userId
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updatePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      if (post.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await Post.update(req.params.id, req.body.content);
      res.json({ message: 'Post updated' });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      if (post.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await Post.delete(req.params.id);
      res.json({ message: 'Post deleted' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = postController;
