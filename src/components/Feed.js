import React from 'react';
import Post from './Post';
import '../styles/styles.css';
const Feed = ({ posts, likedPosts, handleLike, handleShare, deletePost }) => {
  return (
    <div className="feed">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post-item">
            <Post
              username={post.username || "Anonymous"} 
              title={post.title}
              content={post.content}
              postId={post.id}
              onLike={() => handleLike(post.id)} 
              isLiked={likedPosts[post.id] || false}  
            />
            <div className="post-actions">
              <button className="delete-button" onClick={() => deletePost(post.id)}>
                🗑️
              </button>
              <button
                className={`like-button ${likedPosts[post.id] ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)} 
              >
                {likedPosts[post.id] ? '❤️' : '🤍'}  { }
              </button>
              <button
                className="share-button"
                onClick={() => handleShare(post.id)} 
              >
                🔗
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Feed;
