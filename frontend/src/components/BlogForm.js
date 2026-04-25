// src/components/BlogForm.js — Form to add a new blog post

import React, { useState } from 'react';

function BlogForm({ onBlogAdded }) {
  // Controlled component: React state drives the form inputs
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Handle form submission ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser page refresh

    // Basic client-side validation
    if (!title.trim() || !content.trim()) {
      setMessage('❌ Please fill in both title and content.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // POST request to the backend to create a new blog
      const response = await fetch('/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell server we're sending JSON
        },
        body: JSON.stringify({ title, content }), // Convert JS object to JSON string
      });

      if (response.ok) {
        const newBlog = await response.json();

        // Notify the parent (App.js) that a new blog was created
        onBlogAdded(newBlog);

        // Clear the form
        setTitle('');
        setContent('');
        setMessage('✅ Blog posted successfully!');
      } else {
        const err = await response.json();
        setMessage(`❌ Error: ${err.message}`);
      }
    } catch (error) {
      setMessage('❌ Failed to connect to server. Is the backend running?');
      console.error('POST error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add a New Blog Post</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Blog Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)} // useState hook updates on every keystroke
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Blog Content</label>
          <textarea
            id="content"
            rows="6"
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post Blog'}
        </button>
      </form>

      {/* Show success or error message */}
      {message && <p className="form-message">{message}</p>}
    </div>
  );
}

export default BlogForm;
