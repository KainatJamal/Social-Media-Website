// SignupPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

function SignupPage({ onSignup }) {
  const [profilePicture, setProfilePicture] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("bio", bio);
    if (profilePicture) {
      const blob = await fetch(profilePicture).then((res) => res.blob());
      formData.append("profilePicture", blob, "profilePicture.jpg");
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMessage(response.data.message);
      setError('');
      localStorage.setItem('profilePicture', profilePicture);
      localStorage.setItem('fullName', fullName);  // Save full name in local storage
      onSignup(profilePicture);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    
    } catch (error) {
      setError('Error signing up: ' + (error.response?.data?.error || error.message));
      setSuccessMessage('');
    }
  };

  return (
    <div className="signup-header">
      <header>
        <h2>Create Your Account</h2>
      </header>
      <div className="signup-container">
        <h1>Signup Page</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture:</label>
            <input type="file" id="profilePicture" onChange={handleFileChange} />
            {profilePicture && (
              <img src={profilePicture} alt="Profile Preview" className="profile-picture" />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
            />
          </div>
          <button type="submit" className="post-button">Sign Up</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
