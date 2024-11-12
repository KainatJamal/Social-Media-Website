// Header.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';
import logo from '../components/Untitled_design-removebg-preview.png';

function Header({ onLogout, addPost }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [postContent, setPostContent] = useState(''); // Store post content
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedProfilePicture = localStorage.getItem('profilePicture');
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    }
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('profilePicture');
    onLogout();
    setIsDropdownOpen(false);
    setProfilePicture(null);
  };

  const handlePostClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPostContent('');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle creating a new post
  const handleSubmitPost = () => {
    const newPost = {
      username: profilePicture ? 'User' : 'Guest', // Assign a username based on login status
      content: postContent,
    };
    addPost(newPost); // Add new post to Feed
    handleCloseModal(); // Close modal after posting
  };

  return (
    <>
      <header>
        <div className="header__left" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="logo" className="header__logo" />
          <h2>Social Media</h2>
        </div>

        <div className="header__right">
          <input type="text" placeholder="Start a post..." onClick={handlePostClick} />

          <div className="profile-container">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="profile-button profile-picture-header"
                onClick={toggleDropdown}
              />
            ) : (
              <button className="plus-button" onClick={handleLoginClick}>+</button>
            )}

            {isDropdownOpen && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <button onClick={handleLoginClick}>Login</button> 
                {profilePicture && <button onClick={handleLogoutClick}>Logout</button>}
              </div>
            )}
          </div>
        </div>
      </header>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <textarea
              placeholder="Write your post..."
              className="modal-textarea"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="close-button" onClick={handleCloseModal}>Cancel</button>
              <button className="post-button" onClick={handleSubmitPost}>Post</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
