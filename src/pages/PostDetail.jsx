import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/PostContent.css';

const API = 'http://localhost:3000';
const DEFAULT_AVATAR = 'https://via.placeholder.com/40';

const PostDetail = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);

      const res = await axios.get(`${API}/comments`, {
        params: { post_id: id },
      });

      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Lỗi tải comment:', error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const checkBookmark = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId || !id) return;

      const res = await axios.get(`${API}/bookmarks/check`, {
        params: {
          user_id: userId,
          post_id: id,
        },
      });

      setIsBookmarked(!!res.data.bookmarked);
    } catch (error) {
      console.error('Lỗi kiểm tra bookmark:', error);
    }
  };

  const handleToggleBookmark = async () => {
    try {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        alert('Bạn cần đăng nhập để lưu bài viết');
        return;
      }

      setBookmarkLoading(true);

      if (isBookmarked) {
        await axios.delete(`${API}/bookmarks`, {
          data: {
            user_id: userId,
            post_id: id,
          },
        });
        setIsBookmarked(false);
      } else {
        await axios.post(`${API}/bookmarks`, {
          user_id: userId,
          post_id: id,
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Lỗi bookmark:', error);
      alert(error?.response?.data?.message || 'Không xử lý được bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API}/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error('Lỗi tải bài viết:', error);
      }
    };

    const fetchRelatedPosts = async () => {
      try {
        const res = await axios.get(`${API}/posts`);
        const items = Array.isArray(res.data) ? res.data : [];
        setRelatedPosts(items.filter((p) => String(p.id) !== String(id)).slice(0, 5));
      } catch (error) {
        console.error('Lỗi tải bài viết liên quan:', error);
      }
    };

    if (id) {
      fetchPost();
      fetchRelatedPosts();
      fetchComments();
      checkBookmark();
    }
  }, [id]);

  const shareUrl = window.location.href;

  const renderContent = (content) => {
    if (!content) return '';

    const youtubeRegex =
      /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+))/g;

    return content.replace(youtubeRegex, (_, __, videoId) => {
      return `
        <div style="margin:20px 0;">
          <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/${videoId}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="border-radius:12px;"
          ></iframe>
        </div>
      `;
    });
  };

  const formattedDate = useMemo(() => {
    if (!post?.created_at) return '';
    return new Date(post.created_at).toLocaleDateString('vi-VN');
  }, [post]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Bạn cần đăng nhập để bình luận');
      return;
    }

    if (!newComment.trim()) {
      alert('Vui lòng nhập nội dung bình luận');
      return;
    }

    try {
      setSubmittingComment(true);

      await axios.post(`${API}/comments`, {
        content: newComment.trim(),
        user_id: userId,
        post_id: id,
      });

      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Lỗi gửi comment:', error);
      alert(error?.response?.data?.message || 'Không gửi được comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId, commentUserId) => {
    const userId = localStorage.getItem('userId');

    if (!userId || String(userId) !== String(commentUserId)) {
      alert('Bạn chỉ có thể xóa comment của mình');
      return;
    }

    const ok = window.confirm('Bạn có chắc muốn xóa bình luận này?');
    if (!ok) return;

    try {
      await axios.delete(`${API}/comments/${commentId}`);
      await fetchComments();
    } catch (error) {
      console.error('Lỗi xóa comment:', error);
      alert(error?.response?.data?.message || 'Xóa comment thất bại');
    }
  };

  if (!post) {
    return <p className="text-center mt-5">Đang tải bài viết...</p>;
  }

  return (
    <div className="container py-3">
      <div className="row">
        <div className="col-lg-8">
          <nav className="mb-2 text-muted small">
            <Link to="/">Trang chủ</Link> / {post.region_name || 'Ẩm thực'} / Bài viết
          </nav>

          <div className="mb-3 d-flex flex-wrap align-items-center text-muted small gap-3">
            <div>
              Viết bởi <strong>{post.author_name || 'Ẩn danh'}</strong>
              {formattedDate ? ` - ${formattedDate}` : ''}
            </div>
          </div>

          <h1 className="fw-bold mb-3">{post.title}</h1>

          <button
            type="button"
            className={`btn mb-3 ${isBookmarked ? 'btn-success' : 'btn-warning'}`}
            onClick={handleToggleBookmark}
            disabled={bookmarkLoading}
          >
            {bookmarkLoading ? 'Đang xử lý...' : isBookmarked ? 'Đã lưu bài' : 'Lưu bài'}
          </button>

          {post.image_url && (
            <div className="mb-4">
              <img
                src={`${API}/images/${post.image_url}`}
                alt={post.title}
                className="img-fluid rounded w-100"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="mb-4 d-flex gap-2 flex-wrap">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              className="btn btn-sm btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
              className="btn btn-sm btn-info text-white"
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              className="btn btn-sm btn-secondary"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`}
              className="btn btn-sm btn-dark"
            >
              Email
            </a>
          </div>

          <div
            className="mb-4 post-body-content"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />

          <hr />

          <h5 className="fw-bold mt-4 mb-3">Bình luận</h5>

          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              className="form-control mb-2"
              rows="3"
              placeholder="Viết bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submittingComment}
            >
              {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </form>

          {loadingComments ? (
            <p>Đang tải bình luận...</p>
          ) : comments.length === 0 ? (
            <p>Chưa có bình luận nào.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="border rounded p-3 mb-2">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div className="d-flex align-items-start gap-2">
                    <img
                      src={
                        c.users?.avatar
                          ? `${API}/images/${c.users.avatar}`
                          : DEFAULT_AVATAR
                      }
                      alt={c.users?.username || 'Ẩn danh'}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                    />

                    <div>
                      <div className="fw-bold">{c.users?.username || 'Ẩn danh'}</div>
                      <div className="text-muted small mb-1">
                        {c.created_at
                          ? new Date(c.created_at).toLocaleString('vi-VN')
                          : ''}
                      </div>
                      <div>{c.content}</div>
                    </div>
                  </div>

                  {String(localStorage.getItem('userId')) === String(c.user_id) && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteComment(c.id, c.user_id)}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          <hr />

          <h5 className="fw-bold mt-4 mb-3">Bài viết liên quan</h5>
          <div className="row">
            {relatedPosts.map((p) => (
              <div key={p.id} className="col-md-4 mb-3">
                <Link to={`/post/${p.id}`} className="text-decoration-none text-dark">
                  <div className="card border-0 shadow-sm h-100">
                    {p.image_url && (
                      <img
                        src={`${API}/images/${p.image_url}`}
                        alt={p.title}
                        style={{ height: 160, objectFit: 'cover' }}
                        className="card-img-top"
                      />
                    )}
                    <div className="card-body px-3 py-2">
                      <h6
                        className="card-title fw-semibold mb-1"
                        style={{ fontSize: '0.95rem', lineHeight: '1.3em' }}
                      >
                        {p.title}
                      </h6>
                      <small className="text-muted">{p.author_name || 'Ẩn danh'}</small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Thông tin bài viết</h5>
              <p className="mb-2">
                <strong>Tác giả:</strong> {post.author_name || 'Ẩn danh'}
              </p>
              <p className="mb-2">
                <strong>Miền:</strong> {post.region_name || 'Chưa có'}
              </p>
              <p className="mb-0">
                <strong>Ngày đăng:</strong> {formattedDate || 'Chưa có'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;