import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3000';

const RegionPostsNam = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API}/posts/region/mien-nam`);
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Lỗi tải bài miền Nam:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Ẩm thực Miền Nam</h2>

      {posts.length === 0 ? (
        <p>Chưa có bài viết nào.</p>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div key={post.id} className="col-md-4 mb-3">
              <Link to={`/post/${post.id}`} className="text-decoration-none text-dark">
                <div className="card h-100 shadow-sm border-0">
                  {post.image_url && (
                    <img
                      src={`${API}/images/${post.image_url}`}
                      alt={post.title}
                      className="card-img-top"
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="fw-bold">{post.title}</h5>
                    <small className="text-muted">
                      {post.author_name || 'Ẩn danh'}
                    </small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegionPostsNam;