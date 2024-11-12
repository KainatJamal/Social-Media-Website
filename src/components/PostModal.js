import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import '../styles/styles.css';

function PostModal({ setTrendingHashtags }) {
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const token = localStorage.getItem('token');

  // Function to handle post click and open modal
  const handlePostClick = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle image selection for the post
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Function to extract hashtags from post content
  const extractHashtags = (content) => {
    const hashtagPattern = /#(\w+)/g;
    const hashtags = [...content.matchAll(hashtagPattern)].map(match => match[0]);
    return hashtags;
  };

  // Function to handle post submit
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('postContent', postContent);
    if (selectedImage) formData.append('image', selectedImage);

    try {
      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Extract hashtags from the post content
      const hashtags = extractHashtags(postContent);

      // Update trending hashtags in the parent component (passed via props)
      setTrendingHashtags(hashtags);

      alert(response.data.message);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Post creation failed", error);
    }
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create a new post</h3>
            <form onSubmit={handlePostSubmit}>
              <textarea
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <input type="file" onChange={handleImageChange} />
              <button type="submit">Post</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      <button className="add-post-button" onClick={handlePostClick}>
        <FaPlus /> Add Post
      </button>
    </div>
  );
}

export default PostModal;
