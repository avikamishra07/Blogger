// controllers/blogController.js — Business logic for blog operations

const Blog = require('../models/Blog');

// ─── GET /blogs ───────────────────────────────────────────────────────────────
// Fetch all blogs from MongoDB, newest first
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};

// ─── POST /blogs ──────────────────────────────────────────────────────────────
// Create and save a new blog post to MongoDB
const createBlog = async (req, res) => {
  const { title, content } = req.body;

  // Basic validation
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const newBlog = new Blog({ title, content });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};

module.exports = { getAllBlogs, createBlog };
