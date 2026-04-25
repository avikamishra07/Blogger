# MERN Stack Blogger Application
### College Submission — Full Stack Web Development

---

## 📁 Project Structure

```
mern-blogger/
│
├── backend/                  ← Node.js + Express server
│   ├── controllers/
│   │   └── blogController.js ← Business logic (GET, POST)
│   ├── models/
│   │   └── Blog.js           ← Mongoose schema
│   ├── routes/
│   │   └── blogRoutes.js     ← Express routes
│   ├── server.js             ← Main server file
│   ├── .env                  ← Environment variables (MongoDB URI)
│   └── package.json
│
└── frontend/                 ← React application
    ├── public/
    │   └── index.html        ← Root HTML file
    ├── src/
    │   ├── components/
    │   │   ├── BlogCard.js   ← Displays one blog post
    │   │   ├── BlogForm.js   ← Form to add a new blog
    │   │   └── BlogList.js   ← Renders all blog cards
    │   ├── App.js            ← Root React component
    │   ├── App.css           ← Styling
    │   └── index.js          ← React entry point
    └── package.json
```

---

## ⚙️ Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | React.js (Hooks)            |
| Backend  | Node.js + Express.js        |
| Database | MongoDB Atlas via Mongoose  |
| HTTP     | fetch API / Axios           |

---

## 🔧 Step-by-Step Setup

### Step 1 — MongoDB Atlas Setup

1. Go to **https://cloud.mongodb.com** and create a free account.
2. Click **"Create a New Project"** → name it `BloggerProject`.
3. Click **"Build a Database"** → choose **Free (M0 Shared)** tier.
4. Choose a cloud provider & region (any) → click **Create**.
5. Under **Security → Database Access**: create a user
   - Username: `blogAdmin`
   - Password: `yourPassword123`
   - Role: **Read and Write to any database**
6. Under **Security → Network Access**: click **"Add IP Address"** → select
   **"Allow Access from Anywhere"** (0.0.0.0/0).
7. Go to **Database → Connect** → choose **"Connect your application"**.
8. Copy the connection string. It looks like:
   ```
   mongodb+srv://blogAdmin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
9. Replace `<password>` with your actual password and add the database name:
   ```
   mongodb+srv://blogAdmin:yourPassword123@cluster0.abcde.mongodb.net/bloggerDB?retryWrites=true&w=majority
   ```

---

### Step 2 — Backend Setup

```bash
# Navigate to backend folder
cd mern-blogger/backend

# Install dependencies
npm install

# Create your .env file (already provided — just update MONGO_URI)
# Edit .env and paste your MongoDB Atlas connection string

# Start the server
node server.js

# OR use nodemon for auto-reload during development
npx nodemon server.js
```

✅ You should see:
```
✅ Connected to MongoDB Atlas
🚀 Server running on http://localhost:5000
```

---

### Step 3 — Frontend Setup

```bash
# Open a NEW terminal window

# Navigate to frontend folder
cd mern-blogger/frontend

# Install dependencies
npm install

# Start the React app
npm start
```

✅ The browser will open at **http://localhost:3000**

---

## 📄 Sample .env File (backend/.env)

```
MONGO_URI=mongodb+srv://blogAdmin:yourPassword123@cluster0.abcde.mongodb.net/bloggerDB?retryWrites=true&w=majority
PORT=5000
```

> ⚠️ Never upload your .env file to GitHub. Add it to .gitignore.

---

## 🌐 REST API Endpoints

| Method | Endpoint  | Description          | Request Body              |
|--------|-----------|----------------------|---------------------------|
| GET    | /blogs    | Fetch all blog posts | None                      |
| POST   | /blogs    | Create a new blog    | `{ title, content }`      |

### Example — POST /blogs

**Request:**
```json
POST http://localhost:5000/blogs
Content-Type: application/json

{
  "title": "My First Blog",
  "content": "This is my first MERN blog post!"
}
```

**Response (201 Created):**
```json
{
  "_id": "6451a2b3c4d5e6f7a8b9c0d1",
  "title": "My First Blog",
  "content": "This is my first MERN blog post!",
  "createdAt": "2024-05-03T10:30:00.000Z",
  "updatedAt": "2024-05-03T10:30:00.000Z"
}
```

---

## 📂 Complete File Code

---

### backend/server.js
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const blogRoutes = require('./routes/blogRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/blogs', blogRoutes);

app.get('/', (req, res) => {
  res.send('MERN Blogger API is running...');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
```

---

### backend/models/Blog.js
```javascript
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }  // Adds createdAt and updatedAt automatically
);

module.exports = mongoose.model('Blog', blogSchema);
```

---

### backend/routes/blogRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const { getAllBlogs, createBlog } = require('../controllers/blogController');

router.get('/',  getAllBlogs);   // GET  /blogs
router.post('/', createBlog);   // POST /blogs

module.exports = router;
```

---

### backend/controllers/blogController.js
```javascript
const Blog = require('../models/Blog');

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};

const createBlog = async (req, res) => {
  const { title, content } = req.body;
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
```

---

### frontend/src/App.js
```javascript
import React, { useState, useEffect } from 'react';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import './App.css';

function App() {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []); // [] means: run only once, when component first renders

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogAdded = (newBlog) => {
    setBlogs([newBlog, ...blogs]); // Add new blog at the top
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📝 MERN Blogger</h1>
        <p>A simple blog app built with MongoDB, Express, React and Node.js</p>
      </header>
      <main>
        <BlogForm onBlogAdded={handleBlogAdded} />
        {loading ? <p>Loading blogs...</p> : <BlogList blogs={blogs} />}
      </main>
    </div>
  );
}

export default App;
```

---

### frontend/src/components/BlogForm.js
```javascript
import React, { useState } from 'react';

function BlogForm({ onBlogAdded }) {
  const [title, setTitle]         = useState('');
  const [content, setContent]     = useState('');
  const [message, setMessage]     = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMessage('❌ Please fill in both title and content.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const newBlog = await response.json();
        onBlogAdded(newBlog);
        setTitle('');
        setContent('');
        setMessage('✅ Blog posted successfully!');
      } else {
        const err = await response.json();
        setMessage(`❌ Error: ${err.message}`);
      }
    } catch (error) {
      setMessage('❌ Failed to connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add a New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Blog Title</label>
          <input
            type="text"
            placeholder="Enter blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Blog Content</label>
          <textarea
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
      {message && <p className="form-message">{message}</p>}
    </div>
  );
}

export default BlogForm;
```

---

### frontend/src/components/BlogList.js
```javascript
import React from 'react';
import BlogCard from './BlogCard';

function BlogList({ blogs }) {
  if (blogs.length === 0) {
    return <div className="no-blogs"><p>No blogs yet. Be the first to post!</p></div>;
  }

  return (
    <div className="blog-list">
      <h2>All Blog Posts ({blogs.length})</h2>
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
}

export default BlogList;
```

---

### frontend/src/components/BlogCard.js
```javascript
import React from 'react';

function BlogCard({ blog }) {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
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
```

---

## 🔗 How React Connects to the Backend (Viva Explanation)

```
React (localhost:3000)
        │
        │  fetch('/blogs')      ← proxy forwards to localhost:5000
        ▼
Express Server (localhost:5000)
        │
        │  router.get('/blogs') / router.post('/blogs')
        ▼
Controller (getAllBlogs / createBlog)
        │
        │  Blog.find() / newBlog.save()
        ▼
MongoDB Atlas (Cloud Database)
```

**Key concept — The Proxy:**
In `frontend/package.json`, we have:
```json
"proxy": "http://localhost:5000"
```
This tells React's dev server: "If you get a request that isn't for a React file
(like `/blogs`), forward it to port 5000." This avoids CORS issues during development.

---

## 🗄️ How Data is Stored in MongoDB (Viva Explanation)

When a user fills in the form and clicks **"Post Blog"**:

1. React collects `title` and `content` from state.
2. A **POST request** is sent to `/blogs` with JSON body: `{ title, content }`.
3. Express receives it, and the `createBlog` controller runs.
4. Mongoose creates a new document using the **Blog schema**:
   ```js
   const newBlog = new Blog({ title, content });
   await newBlog.save();  // Sends INSERT to MongoDB Atlas
   ```
5. MongoDB stores it in the **`bloggerDB`** database, **`blogs`** collection.
6. The saved document (with `_id` and timestamps) is returned as the API response.
7. React receives the response and updates the page without reloading.

**MongoDB document example (stored in Atlas):**
```json
{
  "_id": "6451a2b3c4d5e6f7a8b9c0d1",
  "title": "My First Blog",
  "content": "This is my first MERN blog post!",
  "createdAt": "2024-05-03T10:30:00.000Z",
  "updatedAt": "2024-05-03T10:30:00.000Z",
  "__v": 0
}
```

---

## 🎤 Viva / Interview Questions & Answers

**Q1: What is MERN Stack?**
MERN is a full-stack JavaScript framework that uses:
- **M**ongoDB – NoSQL database (stores data as JSON-like documents)
- **E**xpress.js – Backend web framework for Node.js (handles routing)
- **R**eact.js – Frontend library for building user interfaces
- **N**ode.js – JavaScript runtime for running server-side code

**Q2: What are React Hooks? Which ones did you use?**
Hooks let you use state and lifecycle features in functional components.
- `useState` – stores and updates component data (blog list, form inputs)
- `useEffect` – runs side effects (like fetching data when the page loads)

**Q3: What is Mongoose and why use it?**
Mongoose is an ODM (Object Data Modeling) library for MongoDB. It lets us define
schemas, so we know exactly what shape our data will have. Without it, we could store
anything in MongoDB — with it, our Blog documents always have `title`, `content`,
and `createdAt`.

**Q4: What is CORS and why is it needed?**
CORS (Cross-Origin Resource Sharing) is a browser security rule that blocks requests
between different origins (different ports count as different origins). Since React runs
on port 3000 and Express on port 5000, we need to enable CORS on the backend using the
`cors` npm package so the browser allows the request.

**Q5: What is the difference between GET and POST?**
- **GET** – fetches data from the server. No request body. Used for reading blogs.
- **POST** – sends data to the server. Has a request body (title, content). Used for
  creating a new blog.

**Q6: What is .env file and why use it?**
A `.env` file stores sensitive configuration like database credentials. We use the
`dotenv` package to load these values into `process.env`. This way, we don't
hardcode secrets in the code or push them to GitHub.

**Q7: What is Mongoose's `timestamps: true` option?**
It automatically adds two fields to every document:
- `createdAt` – when the document was first saved
- `updatedAt` – when the document was last modified
We don't need to set these manually.

**Q8: Explain the flow when a user submits a blog.**
1. User fills form → React state updates via `onChange`
2. User clicks submit → `handleSubmit` runs
3. React sends POST request to `/blogs` with JSON data
4. Express routes it to `createBlog` controller
5. Mongoose creates and saves a Blog document in MongoDB Atlas
6. MongoDB returns the saved document
7. Express sends it back as a JSON response
8. React receives it, calls `handleBlogAdded` to update the list
9. New blog appears on screen — no page reload needed

---

## 🚀 Running the Application

Open two terminals simultaneously:

**Terminal 1 — Backend:**
```bash
cd mern-blogger/backend
npm install
node server.js
```

**Terminal 2 — Frontend:**
```bash
cd mern-blogger/frontend
npm install
npm start
```

Visit **http://localhost:3000** in your browser.

---

## 📦 Dependencies Summary

### Backend
| Package    | Purpose                                 |
|------------|-----------------------------------------|
| express    | Web framework, handles HTTP routing     |
| mongoose   | MongoDB ODM, schema + database ops      |
| cors       | Enables cross-origin requests           |
| dotenv     | Loads .env variables into process.env   |
| nodemon    | Dev tool: auto-restarts server on save  |

### Frontend
| Package         | Purpose                              |
|-----------------|--------------------------------------|
| react           | UI library                           |
| react-dom       | Renders React to the browser DOM     |
| react-scripts   | CRA build toolchain (Webpack, Babel) |
| axios (optional)| Alternative HTTP client to fetch     |

---

*Prepared for Full Stack Web Development — MERN Stack Module*
