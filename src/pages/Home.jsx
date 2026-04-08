import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/Home.css';

const API = 'http://localhost:3000';
const FALLBACK_IMAGE = '/images/banner-doc.jpg';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API}/posts`);
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Lỗi posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = () => {
    const value = keyword.trim();
    if (!value) return;
    navigate(`/search?q=${encodeURIComponent(value)}&page=1`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const regions = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Miền Nam'];

  const filteredPosts =
    activeTab === 'Tất cả'
      ? posts
      : posts.filter((p) => p.region_name === activeTab);

  const popularPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [posts]);

  const explorePosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
  }, [posts]);

  const latestPosts = useMemo(() => {
    return [...filteredPosts]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 6);
  }, [filteredPosts]);

  if (loading) {
    return <div className="container py-5 text-center">Đang tải bài viết...</div>;
  }

  if (!posts.length) {
    return <div className="container py-5 text-center">Chưa có bài viết nào.</div>;
  }

  return (
    <div className="home-page">
      <div className="container py-4">
        <section className="hero-parallax hero-compact mb-4">
          <div className="hero-parallax-overlay">
            <div className="text-center hero-content">
              <h1 className="hero-parallax-title compact-title">Tinh Hoa Ẩm Thực Việt</h1>
              <p className="hero-parallax-sub compact-sub">
                Khám phá hương vị ba miền qua từng món ăn
              </p>
            </div>
          </div>
        </section>

        <div className="home-sticky-tabs mb-4">
          <div className="home-toolbar">
            <div className="region-tabs-wrap">
              {regions.map((region) => (
                <button
                  key={region}
                  className={`region-tab-btn ${activeTab === region ? 'active' : ''}`}
                  onClick={() => setActiveTab(region)}
                >
                  {region}
                </button>
              ))}
            </div>

            <div className="search-box-home">
              <input
                type="text"
                className="search-input-home"
                placeholder="Tìm bài viết..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="search-btn-home" onClick={handleSearch}>
                Tìm
              </button>
            </div>
          </div>
        </div>

        <section className="mb-5">
          <div className="section-header">
            <div>
              <p className="section-kicker">Nổi bật hôm nay</p>
              <h3 className="section-title">Khám phá ẩm thực ba miền</h3>
            </div>
          </div>

          <div className="row g-4">
            {explorePosts.map((post, index) => (
              <div className={index === 0 ? 'col-lg-6' : 'col-lg-3 col-md-6'} key={post.id}>
                <Link to={`/post/${post.id}`} className="text-decoration-none">
                  <div className={`featured-card ${index === 0 ? 'featured-large' : ''}`}>
                    <div className="featured-image-wrap">
                      <img
                        src={`${API}/images/${post.image_url}`}
                        alt={post.title}
                        className="featured-image"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>

                    <div className="featured-overlay">
                      <span className="featured-badge">
                        {post.region_name || 'Ẩm thực'}
                      </span>
                      <h5 className="featured-title">{post.title}</h5>
                      <small className="featured-meta">
                        {post.author_name || 'Ẩn danh'}
                      </small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="row gx-4 gy-4">
          <div className="col-lg-8">
            <div className="section-header mb-3">
              <div>
                <p className="section-kicker">Bài viết mới</p>
                <h3 className="section-title">
                  {activeTab === 'Tất cả' ? 'Tất cả bài viết' : activeTab}
                </h3>
              </div>
            </div>

            <div className="row g-4">
              {latestPosts.length === 0 ? (
                <div className="col-12">
                  <div className="empty-box">Chưa có bài viết nào cho mục này.</div>
                </div>
              ) : (
                latestPosts.map((post) => (
                  <div className="col-md-6" key={post.id}>
                    <Link to={`/post/${post.id}`} className="text-decoration-none">
                      <article className="food-card h-100">
                        <div className="food-card-image-wrap">
                          <img
                            src={`${API}/images/${post.image_url}`}
                            className="food-card-image"
                            alt={post.title}
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_IMAGE;
                            }}
                          />
                        </div>

                        <div className="food-card-body">
                          <div className="food-card-topline">
                            <span className="food-card-region">
                              {post.region_name || 'Ẩm thực'}
                            </span>
                            <span className="food-card-date">
                              {post.created_at
                                ? new Date(post.created_at).toLocaleDateString('vi-VN')
                                : ''}
                            </span>
                          </div>

                          <h5 className="food-card-title">{post.title}</h5>

                          <p className="food-card-author">
                            {post.author_name || 'Ẩn danh'}
                          </p>
                        </div>
                      </article>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="sidebar-box">
              <div className="section-header mb-3">
                <div>
                  <p className="section-kicker">Đề xuất</p>
                  <h4 className="section-title small-title">Bài viết phổ biến</h4>
                </div>
              </div>

              <div className="popular-list">
                {popularPosts.map((post, index) => (
                  <Link
                    to={`/post/${post.id}`}
                    key={post.id}
                    className="popular-item text-decoration-none"
                  >
                    <div className="popular-rank">{index + 1}</div>

                    <img
                      src={`${API}/images/${post.image_url}`}
                      className="popular-thumb"
                      alt={post.title}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />

                    <div className="popular-content">
                      <h6 className="popular-title">{post.title}</h6>
                      <small className="popular-meta">
                        {post.author_name || 'Ẩn danh'} •{' '}
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString('vi-VN')
                          : ''}
                      </small>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;