import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import HotSidebar from '../components/Post/HotSidebar';

const RegionPostsNam = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5094/api/Post')
      .then(res => {
        const filtered = res.data.filter(p => p.regionName === 'Miền Nam');
        setPosts(filtered);
      });
  }, []);

  return (
    <div className="container py-4">
      <h3 className="text-center fw-bold mb-4">ẨM THỰC MIỀN NAM</h3>
      <div className="row">
        <div className="col-lg-8">
          {posts.map(post => (
            <div key={post.id} className="d-flex mb-4">
              <Link to={`/post/${post.id}`}>
                <img
                  src={`http://localhost:5094/images/${post.imageUrl}`}
                  alt={post.title}
                  className="me-3 rounded"
                  style={{ width: 200, height: 130, objectFit: 'cover' }}
                />
              </Link>
              <div>
                <Link to={`/post/${post.id}`} className="text-dark text-decoration-none">
                  <h5 className="fw-bold mb-1">{post.title}</h5>
                </Link>
                <p className="text-muted small mb-0">
                  {(post.content || '').replace(/<[^>]+>/g, '').slice(0, 100)}...
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <HotSidebar />
        </div>
      </div>
    </div>
  );
};

export default RegionPostsNam;
