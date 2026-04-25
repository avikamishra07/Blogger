// src/App.js — Root component of the React application

import React, { useState, useEffect } from 'react';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import './App.css';

function App() {
  // State to hold the list of all blog posts fetched from the backend
  const [blogs, setBlogs] = useState([]);

  // State to show a loading message while data is being fetched
  const [loading, setLoading] = useState(true);

  // ─── Fetch all blogs on component mount ────────────────────────────────────
  // useEffect runs once when the component first renders (empty dependency array [])
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Fetch data from the backend REST API
      // Because of the "proxy" in package.json, '/blogs' → 'http://localhost:5000/blogs'
      const response = await fetch('/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Called by BlogForm after a new blog is posted ─────────────────────────
  // Adds the new blog to the top of the list without re-fetching everything
  const handleBlogAdded = (newBlog) => {
    setBlogs([newBlog, ...blogs]);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1> MERN Blogger</h1>
      </header>

      <main>
        {/* Form component for adding a new blog */}
        <BlogForm onBlogAdded={handleBlogAdded} />

        {/* Blog list component */}
        {loading ? (
          <p className="loading-text">Loading blogs...</p>
        ) : (
          <BlogList blogs={blogs} />
        )}
      </main>
    </div>
  );
}

export default App;
