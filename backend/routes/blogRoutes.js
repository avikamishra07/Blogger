// routes/blogRoutes.js — Express Router for blog endpoints

const express = require('express');
const router = express.Router();
const { getAllBlogs, createBlog } = require('../controllers/blogController');

// GET  /blogs     → returns all blog posts
router.get('/', getAllBlogs);

// POST /blogs     → creates a new blog post
router.post('/', createBlog);

module.exports = router;
