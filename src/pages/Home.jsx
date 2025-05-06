// Home.jsx FINAL
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('Tất cả');

  useEffect(() => {
    axios.get('http://localhost:5094/api/Post')
        .then(res => setPosts(res.data))
        .catch(err => console.error(err));
  }, []);

  if (posts.length < 4) {
    return <div className="container py-5 text-center">Đang tải bài viết...</div>;
  }

  const regions = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Miền Nam'];

  const filteredPosts = activeTab === 'Tất cả'
      ? posts
      : posts.filter(p => p.regionName === activeTab);

  const popularPosts = [...posts]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

  const mainPost = posts[0];
  const rightTopPost = posts[1];
  const rightBottomPosts = posts.slice(2, 4);

  return (
      <div className="container py-4">

        {/* Khu vực nổi bật */}
        <div className="row gx-3">
          <div className="col-lg-6">
            <div className="big-post position-relative overflow-hidden">
              <Link to={`/post/${mainPost.id}`}>
                <img src={`http://localhost:5094/images/${mainPost.imageUrl}`} alt={mainPost.title} className="w-100 h-100 object-cover" />
                <div className="category-label">{mainPost.regionName || 'Ẩm Thực'}</div>
                <div className="overlay-content p-3">
                  <h4 className="fw-bold">{mainPost.title}</h4>
                  <small>{mainPost.authorName || 'Ẩn danh'} - {new Date(mainPost.createdAt).toLocaleDateString('vi-VN')}</small>
                </div>
              </Link>
            </div>
          </div>

          <div className="col-lg-6 d-flex flex-column">
            <div className="right-top-post position-relative mb-2 flex-grow-1">
              <Link to={`/post/${rightTopPost.id}`} className="d-block h-100">
                <img src={`http://localhost:5094/images/${rightTopPost.imageUrl}`} alt={rightTopPost.title} className="w-100 h-100 object-cover" />
                <div className="category-label">{rightTopPost.regionName || 'Culture'}</div>
                <div className="overlay-content p-2">
                  <h6 className="fw-bold">{rightTopPost.title}</h6>
                  <small>{rightTopPost.authorName || 'Ẩn danh'} - {new Date(rightTopPost.createdAt).toLocaleDateString('vi-VN')}</small>
                </div>
              </Link>
            </div>
            <div className="d-flex gap-2" style={{ height: '180px' }}>
              {rightBottomPosts.map(post => (
                  <div className="right-bottom-post w-50 position-relative overflow-hidden" key={post.id}>
                    <Link to={`/post/${post.id}`} className="d-block h-100">
                      <img src={`http://localhost:5094/images/${post.imageUrl}`} alt={post.title} className="w-100 h-100 object-cover" />
                      <div className="category-label">{post.regionName || 'Sport'}</div>
                      <div className="overlay-content p-2">
                        <small className="fw-bold">{post.title}</small>
                      </div>
                    </Link>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs ẩm thực ba miền */}
        <div className="row gx-5 my-5">
          <div className="col-md-8">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h4 className="fw-bold m-0 text-orange">Ẩm Thực Ba Miền</h4>
              <ul className="nav nav-pills">
                {regions.map(region => (
                    <li className="nav-item" key={region}>
                      <button className={`nav-link ${activeTab === region ? 'active' : ''}`} onClick={() => setActiveTab(region)}>
                        {region}
                      </button>
                    </li>
                ))}
              </ul>
            </div>

            {/* Mini posts */}
            <div className="row g-3">
              {filteredPosts.slice(0, 1).map(post => (
                  <div className="col-md-5" key={post.id}>
                    <div className="food-tab-big-post overflow-hidden mb-2">
                      <Link to={`/post/${post.id}`} className="d-block h-100">
                        <img src={`http://localhost:5094/images/${post.imageUrl}`} alt={post.title} className="w-100 h-100 object-cover" />
                      </Link>
                    </div>
                    <h5 className="fw-bold mt-2">
                      <Link to={`/post/${post.id}`} className="text-decoration-none text-dark">
                        {post.title}
                      </Link>
                    </h5>
                  </div>
              ))}
              <div className="col-md-7">
                <div className="row g-2">
                  {filteredPosts.slice(1, 4).map(post => (
                      <div className="col-12 mb-2" key={post.id}>
                        <Link to={`/post/${post.id}`} className="list-mini-post text-decoration-none text-dark">
                          <img src={`http://localhost:5094/images/${post.imageUrl}`} alt={post.title} />
                          <div>
                            <small className="fw-bold d-block">{post.title}</small>
                            <small className="text-muted">
                              {post.authorName || 'Ẩn danh'} - {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                            </small>
                          </div>
                        </Link>
                      </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bắc & Nam */}
            <div className="row mt-5">
              {['Miền Bắc', 'Miền Nam'].map((region, idx) => (
                  <div className="col-md-6" key={idx}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold text-orange">Ẩm Thực {region}</h5>
                      <Link to={`/mien-${region === 'Miền Bắc' ? 'bac' : 'nam'}`} className="small text-decoration-none">MORE &gt;</Link>
                    </div>
                    {posts.filter(p => p.regionName === region).slice(0,1).map(post => (
                        <Link key={post.id} to={`/post/${post.id}`} className="text-decoration-none text-dark d-block mb-2">
                          <img src={`http://localhost:5094/images/${post.imageUrl}`} className="w-100" style={{ height: '200px', objectFit: 'cover' }} alt={post.title} />
                          <h6 className="fw-bold mt-2">{post.title}</h6>
                        </Link>
                    ))}
                    <div className="list-unstyled">
                      {posts.filter(p => p.regionName === region).slice(1,4).map(post => (
                          <Link key={post.id} to={`/post/${post.id}`} className="list-mini-post text-decoration-none text-dark">
                            <img src={`http://localhost:5094/images/${post.imageUrl}`} alt={post.title} />
                            <div>
                              <small className="fw-bold d-block">{post.title}</small>
                              <small className="text-muted">
                                {post.authorName || 'Ẩn danh'} - {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                              </small>
                            </div>
                          </Link>
                      ))}
                    </div>
                  </div>
              ))}
            </div>

            {/* Món Ngon Nổi Bật */}
            <div className="row mt-5">
              <h5 className="fw-bold mb-3">Món Ngon Nổi Bật</h5>
              <div className="row row-cols-1 row-cols-sm-2 g-4">
                {posts.slice(0, 6).map(post => (
                    <div className="col" key={post.id}>
                      <Link to={`/post/${post.id}`} className="text-decoration-none text-dark">
                        <img
                            src={`http://localhost:5094/images/${post.imageUrl}`}
                            alt={post.title}
                            className="w-100"
                            style={{ height: '160px', objectFit: 'cover' }}
                        />
                        <h6 className="mt-2 fw-semibold">{post.title}</h6>
                        <small className="text-muted">{post.authorName || 'Ẩn danh'} - {new Date(post.createdAt).toLocaleDateString('vi-VN')}</small>
                      </Link>
                    </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar bài viết phổ biến */}
          <div className="col-md-4">
            <h5 className="fw-bold border-start border-4 border-dark ps-2 mb-3">Bài viết phổ biến</h5>
            {popularPosts.map(post => (
                <div key={post.id} className="mb-4 popular-post">
                  <Link to={`/post/${post.id}`} className="text-decoration-none text-dark d-block">
                    <img
                        src={`http://localhost:5094/images/${post.imageUrl}`}
                        alt={post.title}
                        style={{ width: '300px', height: '175px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                    />
                    <h6 className="fw-bold text-start mt-2">{post.title}</h6>
                  </Link>
                </div>
            ))}

            {/* Banner dọc */}
            <div className="my-4">
              <img
                  src="/images/banner-doc.jpg"
                  alt="Banner Quảng Cáo"
                  className="img-fluid w-100"
                  style={{ maxHeight: '600px', objectFit: 'cover' }}
              />
            </div>

            {/* Subscribe box */}
            <div className="bg-success text-white p-4 mb-4 rounded">
              <h5 className="fw-bold mb-2">Subscribe</h5>
              <p>Nhận thông báo món ăn mới mỗi tháng qua email.</p>
              <div className="input-group">
                <input type="email" className="form-control" placeholder="Email" />
                <button className="btn btn-light" type="button">→</button>
              </div>
            </div>

            {/* Tags section */}
            <div>
              <h5 className="fw-bold border-start border-4 border-dark ps-2 mb-3">Tags</h5>
              <div className="d-flex flex-wrap gap-2">
                {['Bún', 'Phở', 'Ẩm thực Bắc', 'Ẩm thực Nam', 'Hè', 'Món ngon', 'Mới nhất'].map((tag, i) => (
                    <Link
                        key={i}
                        to={`/tag/${encodeURIComponent(tag)}`}
                        className="badge rounded-pill bg-light text-dark px-3 py-2 border text-decoration-none"
                    >
                      {tag}
                    </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Home;
