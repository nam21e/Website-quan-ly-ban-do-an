import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3000';
const DEFAULT_AVATAR = 'https://via.placeholder.com/80';

const UserProfile = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [loadingMyPosts, setLoadingMyPosts] = useState(true);

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const avatar = localStorage.getItem('avatar');

  const fetchBookmarks = async () => {
    try {
      setLoadingBookmarks(true);

      if (!userId) {
        setBookmarks([]);
        return;
      }

      const res = await axios.get(`${API}/bookmarks`, {
        params: { user_id: userId },
      });

      setBookmarks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Lỗi tải bookmark:', error);
      setBookmarks([]);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      setLoadingMyPosts(true);

      if (!userId) {
        setMyPosts([]);
        return;
      }

      const res = await axios.get(`${API}/posts/my-posts`, {
        params: { user_id: userId },
      });

      setMyPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Lỗi tải bài viết của tôi:', error);
      setMyPosts([]);
    } finally {
      setLoadingMyPosts(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const ok = window.confirm('Bạn có chắc muốn xóa bài viết này?');
    if (!ok) return;

    try {
      await axios.delete(`${API}/posts/${postId}/user-delete`, {
        data: { user_id: userId },
      });

      fetchMyPosts();
    } catch (error) {
      console.error('Lỗi xóa bài viết:', error);
      alert(error?.response?.data?.message || 'Xóa bài viết thất bại');
    }
  };

  useEffect(() => {
    fetchBookmarks();
    fetchMyPosts();
  }, []);

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex align-items-center gap-3">
          <img
            src={avatar ? `${API}/images/${avatar}` : DEFAULT_AVATAR}
            alt="avatar"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
          <div>
            <h4 className="mb-1">{username || 'Người dùng'}</h4>
            <p className="text-muted mb-0">Trang cá nhân</p>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Bài viết của tôi</h5>

          {loadingMyPosts ? (
            <p>Đang tải...</p>
          ) : myPosts.length === 0 ? (
            <p>Bạn chưa đăng bài viết nào.</p>
          ) : (
            <div className="row">
              {myPosts.map((post) => (
                <div key={post.id} className="col-md-4 mb-3">
                  <div className="card h-100 shadow-sm border-0">
                    {post.image_url && (
                      <img
                        src={`${API}/images/${post.image_url}`}
                        alt={post.title}
                        className="card-img-top"
                        style={{ height: 180, objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <h6 className="fw-bold">{post.title}</h6>
                      <small className="text-muted d-block mb-2">
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString('vi-VN')
                          : ''}
                      </small>

                      <div className="d-flex gap-2 flex-wrap">
                        <Link to={`/post/${post.id}`} className="btn btn-sm btn-outline-primary">
                          Xem
                        </Link>
                        <Link
                          to={`/edit-draft/${post.id}`}
                          className="btn btn-sm btn-outline-warning"
                        >
                          Sửa
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Bài viết đã lưu</h5>

          {loadingBookmarks ? (
            <p>Đang tải...</p>
          ) : bookmarks.length === 0 ? (
            <p>Bạn chưa lưu bài viết nào.</p>
          ) : (
            <div className="row">
              {bookmarks.map((item) => {
                const post = item.posts;
                if (!post) return null;

                return (
                  <div key={item.id} className="col-md-4 mb-3">
                    <Link to={`/post/${post.id}`} className="text-decoration-none text-dark">
                      <div className="card h-100 shadow-sm border-0">
                        {post.image_url && (
                          <img
                            src={`${API}/images/${post.image_url}`}
                            alt={post.title}
                            className="card-img-top"
                            style={{ height: 180, objectFit: 'cover' }}
                          />
                        )}
                        <div className="card-body">
                          <h6 className="fw-bold">{post.title}</h6>
                          <small className="text-muted">
                            {post.author_name || 'Ẩn danh'}
                          </small>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;