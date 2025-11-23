const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyUser } = require('../middleware/authMiddleware');
const { verifyAdmin } = require('../middleware/adminMiddleware');

// Admin-only routes
router.use(verifyUser, verifyAdmin);

router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);

router.delete('/posts/:id', adminController.deletePost);
router.delete('/comments/:id', adminController.deleteComment);

module.exports = router;
