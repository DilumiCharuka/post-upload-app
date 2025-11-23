const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Comments for a post
router.get('/post/:postId', commentController.getCommentsByPost);

// Create comment
router.post('/', authMiddleware, commentController.createComment);

// Update comment (only post owner)
router.put('/:id', authMiddleware, commentController.updateComment);

// Delete comment (only post owner)
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;
