// models/Blog.js — Mongoose Schema for a Blog post

const mongoose = require('mongoose');

// Define the shape of a blog document in MongoDB
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the model so it can be used in controllers
module.exports = mongoose.model('Blog', blogSchema);
