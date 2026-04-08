import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API = 'http://localhost:3000';

const EditDraft = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [regionName, setRegionName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/posts/${id}`);
        const data = res.data;

        setPost(data || null);
        setTitle(data?.title || '');
        setContent(data?.content || '');
        setRegionName(data?.region_name || '');
        setPreview(data?.image_url ? `${API}/images/${data.image_url}` : '');
      } catch (error) {
        console.error('Lỗi tải bài viết:', error);
        setMessage(error?.response?.data?.message || 'Không tải được bài viết');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setMessage('');

      if (!title.trim() || !content.trim()) {
        setMessage('Vui lòng nhập tiêu đề và nội dung');
        return;
      }

      let image_url = post?.image_url || null;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await axios.post(`${API}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        image_url = uploadRes.data.filename;
      }

      const username = localStorage.getItem('username');

      await axios.put(`${API}/posts/${id}`, {
        title: title.trim(),
        content: content.trim(),
        image_url,
        author_name: username || post?.author_name || 'Ẩn danh',
        region_name: regionName || null,
      });

      alert('Cập nhật bài viết thành công');
      navigate('/profile');
    } catch (error) {
      console.error('Lỗi cập nhật bài viết:', error);
      setMessage(error?.response?.data?.message || 'Cập nhật bài viết thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container py-4">Đang tải bài viết...</div>;
  }

  if (!post) {
    return <div className="container py-4">Không tìm thấy bài viết.</div>;
  }

  return (
    <div className="container py-4" style={{ maxWidth: '700px' }}>
      <h2 className="fw-bold mb-4">Sửa bài viết</h2>

      {message && (
        <div className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề bài viết"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nội dung</label>
          <textarea
            className="form-control"
            rows="8"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung bài viết"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Chọn miền</label>
          <select
            className="form-control"
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
          >
            <option value="">-- Chọn miền --</option>
            <option value="Miền Bắc">Miền Bắc</option>
            <option value="Miền Trung">Miền Trung</option>
            <option value="Miền Nam">Miền Nam</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Chọn ảnh mới</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {preview && (
          <div className="mb-3">
            <label className="form-label">Xem trước ảnh</label>
            <div>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </div>
          </div>
        )}

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/profile')}
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDraft;