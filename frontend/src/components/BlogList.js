// src/components/BlogList.js — Displays all blog posts

import React from 'react';
import BlogCard from './BlogCard';

function BlogList({ blogs }) {
  // If no blogs exist, show a friendly message
  if (blogs.length === 0) {
    return (
      <div className="no-blogs">
        <p>No blogs yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="blog-list">
      <h2>All Blog Posts ({blogs.length})</h2>

      {/* Map over the blogs array and render a BlogCard for each */}
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
}

export default BlogList;
