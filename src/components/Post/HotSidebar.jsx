import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HotSidebar = () => {
  const [hotPosts, setHotPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5094/api/Post/top-explore')
      .then(res => setHotPosts(res.data.slice(0, 6)))
      .catch(err => console.error("Lỗi khi tải bài viết hot:", err));
  }, []);

  return (
    <div className="hot-sidebar">
      <h6 className="fw-bold text-orange border-bottom pb-2">🔥 Bài viết phổ biến</h6>
      {hotPosts.map(post => (
        <Link
          to={`/post/${post.id}`}
          key={post.id}
          className="d-flex mb-3 text-decoration-none text-dark"
        >
          <img
            src={`http://localhost:5094/images/${post.imageUrl}`}
            alt={post.title}
            style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 8 }}
            className="me-3 flex-shrink-0"
          />
          <div className="d-flex flex-column justify-content-center" style={{ minHeight: 60 }}>
            <small className="fw-semibold text-truncate">{post.title}</small>
            <small className="text-muted" style={{ fontSize: '12px' }}>
              {new Date(post.createdAt).toLocaleDateString('vi-VN')}
            </small>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HotSidebar;
