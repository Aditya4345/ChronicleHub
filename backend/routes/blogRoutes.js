
const express = require('express');
const router = express.Router();

const {
    getAllBlogs,
    getPublishedBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
} = require('../controllers/blogController');

// Public website: Get published blogs
router.get('/published', getPublishedBlogs);

// Admin panel: Get all blogs
router.get('/', getAllBlogs);

// Get individual blog by ID
router.get('/:id', getBlogById);

// Create blog
router.post('/', createBlog);

// Update blog
router.put('/:id', updateBlog);

// Delete blog
router.delete('/:id', deleteBlog);

module.exports = router;
