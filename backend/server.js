const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB URI from environment variable
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsInsecure: true,
  serverApi: { version: ServerApiVersion.v1 },
});

// Connect to MongoDB once
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}
connectDB();

// File upload setup with multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// User Signup Route
// User Signup Route
app.post('/api/users/signup', upload.single('profilePicture'), async (req, res) => {
  try {
    const { fullName, email, password, bio } = req.body;
    const profilePicture = req.file ? req.file.buffer : null;

    const database = client.db("socialMedia");
    const usersCollection = database.collection("signupInfo");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      fullName,    // Store the full name
      email,
      password: hashedPassword,
      bio,
      profilePicture
    };

    const result = await usersCollection.insertOne(user);
    res.status(201).json({ message: 'User created successfully!', userId: result.insertedId });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'An error occurred during signup.' });
  }
});

// User Login Route
// User Login Route
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const database = client.db("socialMedia");
    const usersCollection = database.collection("signupInfo");

    const user = await usersCollection.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { id: user._id, email: user.email, fullName: user.fullName }, // fullName included in the JWT
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(200).json({ message: 'Login successful!', token });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});


// Middleware to authenticate user based on token
// Middleware to authenticate user based on token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route to handle creating a new post
app.post('/api/posts', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { postContent } = req.body;
    const image = req.file ? req.file.buffer : null;

    const database = client.db('socialMedia');
    const postsCollection = database.collection('posts');

    const post = {
      postContent,
      image,
      userFullName: req.user.fullName,  // Use the fullName from the JWT token
      timestamp: new Date(),
    };

    const result = await postsCollection.insertOne(post);
    res.status(201).json({ message: 'Post created successfully!', postId: result.insertedId, fullName: req.user.fullName });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});

// Route to get all posts
// Route to get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const postsCollection = client.db('socialMedia').collection('posts');
    const posts = await postsCollection.find({}).toArray();

    res.status(200).json(posts);  // Return the posts including the userFullName
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts.' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
