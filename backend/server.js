// server.js — Main entry point for the Express backend

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const blogRoutes = require('./routes/blogRoutes');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

// Enable CORS so React (running on port 3000) can talk to this server (port 5000)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────

// All blog-related routes are handled under /blogs
app.use('/blogs', blogRoutes);

// Root route — just a health check
app.get('/', (req, res) => {
  res.send('MERN Blogger API is running...');
});

// ─── Database Connection ──────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
