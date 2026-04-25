// src/components/BlogCard.js — Displays a single blog post

import React from 'react';

function BlogCard({ blog }) {
  // Format the ISO date string into a readable format
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="blog-card">
      <h3 className="blog-title">{blog.title}</h3>
      <p className="blog-content">{blog.content}</p>
      <small className="blog-date">📅 Posted on: {formattedDate}</small>
    </div>
  );
}

export default BlogCard;
