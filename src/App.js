import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; 
import Header from './components/Header';
import Feed from './components/Feed';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

function App() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "Devon Lane",
      title: "The Man Behind The Bomb",
      content: "Christopher Nolan's latest biopic sheds light on the incredible story...",
    },
    {
      id: 2,
      username: "Jerome Bell",
      content: "Hello, world! This is my first post.",
    },
  ]);
  const [likedPosts, setLikedPosts] = useState({});

  useEffect(() => {
    const storedProfilePicture = localStorage.getItem('profilePicture');
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    }
  }, []);

  const handleLogin = (picture) => {
    setProfilePicture(picture);
    localStorage.setItem('profilePicture', picture);
  };

  const handleSignup = (picture) => {
    setProfilePicture(picture);
    localStorage.setItem('profilePicture', picture);
  };

  const handleLogout = () => {
    setProfilePicture(null);
    localStorage.removeItem('profilePicture');
    console.log('User logged out');
  };

  const addPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleLike = (postId) => {
    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: !prevLikedPosts[postId],
    }));
  };

  // Define the deletePost function to delete a post
  const deletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
  };

  // Define handleShare function
  const handleShare = (postId) => {
    const post = posts.find((post) => post.id === postId);
    const postUrl = window.location.href + `#${postId}`; // Create a unique URL for the post (or use a URL template)

    if (navigator.share) {
      // If Web Share API is supported
      navigator.share({
        title: post.title,
        text: post.content,
        url: postUrl,
      }).catch((error) => console.log('Error sharing post:', error));
    } else {
      // If Web Share API is not supported, copy the URL to the clipboard
      navigator.clipboard.writeText(postUrl).then(() => {
        alert('Post URL copied to clipboard! Share it anywhere.');
      }).catch((error) => console.error('Failed to copy URL:', error));
    }
  };

  return (
    <Router>
      <div className="app">
        <Header 
          addPost={addPost} 
          profilePicture={profilePicture} 
          onLogout={handleLogout} 
        />
        <div className="app__body">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <Feed 
                    posts={posts} 
                    likedPosts={likedPosts}  
                    handleLike={handleLike}  
                    handleShare={handleShare} 
                    deletePost={deletePost} // Pass deletePost to Feed
                  />
                  <Sidebar />
                </>
              } 
            />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage onSignup={handleSignup} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
