import React from 'react';
import '../styles/styles.css';

function Sidebar({ trendingHashtags = [] }) {  // Default to empty array if undefined
  return (
    <div className="sidebar">
      <div className="sidebar__section">
        <h3>Follow Suggestions</h3>
        <div className="follow__suggestion">
          <p>John Cooper</p>
          <button>Follow</button>
        </div>
        <div className="follow__suggestion">
          <p>Arlene McCoy</p>
          <button>Follow</button>
        </div>
      </div>

      {/* Display Today's Trends */}
      <div className="sidebar__section">
        <h3>Today’s Trends</h3>
        <div className="hashtags">
          {Array.isArray(trendingHashtags) && trendingHashtags.length > 0 ? (
            trendingHashtags.map((hashtag, index) => (
              <p key={index}>{hashtag}</p>
            ))
          ) : (
            <p>No trends yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
