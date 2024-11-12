// Post.js
import React from 'react';
import '../styles/styles.css';

const Post = ({ username, title, content, postId, onLike, isLiked, onShare }) => {
  return (
    <div className="post">
      <div className="post-header">
        <p className="post-username">{username}</p> {/* Username with specific class */}
      </div>
      <h2>{title}</h2>
      <p>{content}</p>
      <div className="post-actions">

      </div>
    </div>
  );
};

export default Post;
