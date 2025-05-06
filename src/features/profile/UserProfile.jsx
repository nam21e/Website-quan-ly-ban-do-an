import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../features/auth/useAuth';
import avatar from '../../assets/images/avatar.png';
import '../../assets/styles/UserProfile.css';

const TABS = ['Tất cả', 'Được Duyệt', 'Chờ Duyệt', 'Bị Từ Chối', 'Nháp'];

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [posts, setPosts] = useState([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const fullName = localStorage.getItem('fullName') || 'Người dùng';
  const email = localStorage.getItem('email');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:5094/api/myposts/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => setPosts(res.data))
        .catch(err => {
          console.error('Lỗi khi lấy bài viết:', err);
          if (err.response?.status === 401) {
            localStorage.clear();
            navigate('/login');
          }
        });
  }, [navigate]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const filteredPosts = activeTab === 'Tất cả'
      ? posts
      : posts.filter(p => p.status === activeTab);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset về trang 1 khi đổi tab
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
      <div className="container py-4 user-profile">
        {/* Thông tin người dùng */}
        <div className="d-flex align-items-center mb-4 gap-3">
          <img src={avatar} alt="Avatar" className="rounded-circle" style={{ width: 64, height: 64 }} />
          <div>
            <h5 className="mb-0 fw-bold">{fullName}</h5>
            <small className="text-muted">{email}</small>
          </div>
          <div className="ms-auto d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={() => navigate('/update-profile')}>
              ⚙ Cập nhật thông tin
            </button>
            <button className="btn btn-outline-danger" onClick={handleLogout}>Đăng xuất</button>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs border-bottom mb-4">
          {TABS.map(tab => (
              <li key={tab} className="nav-item">
                <button
                    className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              </li>
          ))}
        </ul>

        {/* Danh sách bài viết */}
        <h5 className="fw-bold mb-3">Danh sách bài viết</h5>
        {filteredPosts.length === 0 ? (
            <p>Không có bài viết nào.</p>
        ) : (
            <>
              <ul className="list-group">
                {currentPosts.map(post => (
                    <li key={post.id} className="list-group-item d-flex align-items-center gap-3">
                      <img
                          src={`http://localhost:5094/images/${post.imageUrl}`}
                          alt={post.title}
                          className="rounded"
                          style={{ width: 80, height: 60, objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1">
                        <strong>{post.title}</strong>
                        <br />
                        <small className="text-muted">
                          {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </small>
                        {post.status === 'Bị Từ Chối' && post.rejectReason && (
                            <div className="mt-1 text-danger">
                              ❌ Lý do: <em>{post.rejectReason}</em>
                            </div>
                        )}
                      </div>
                      <span className={`badge ${getBadgeClass(post.status)}`}>{post.status}</span>
                      {post.status === 'Nháp' && (
                          <Link
                              to={`/edit-draft/${post.id}`}
                              className="btn btn-sm btn-outline-primary ms-2"
                          >
                            ✏️ Sửa
                          </Link>
                      )}
                    </li>
                ))}
              </ul>

              {/* Pagination */}
              <nav className="mt-4 d-flex justify-content-center">
                <ul className="pagination">
                  {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }).map((_, idx) => (
                      <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                        <button onClick={() => paginate(idx + 1)} className="page-link">
                          {idx + 1}
                        </button>
                      </li>
                  ))}
                </ul>
              </nav>
            </>
        )}
      </div>
  );
};

// Badge helper
const getBadgeClass = (status) => {
  switch (status) {
    case 'Được Duyệt': return 'bg-success';
    case 'Chờ Duyệt': return 'bg-warning text-dark';
    case 'Bị Từ Chối': return 'bg-danger';
    case 'Nháp': return 'bg-secondary';
    default: return 'bg-light text-dark';
  }
};

export default UserProfile;
