import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

const AddPostUser = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [regionName, setRegionName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file || null);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage('');

      if (!title.trim() || !content.trim()) {
        setMessage('Vui lòng nhập tiêu đề và nội dung');
        return;
      }

      if (!regionName) {
        setMessage('Vui lòng chọn miền');
        return;
      }

      let image_url = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await axios.post(`${API}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        image_url = uploadRes.data.filename;
      }

      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');

      const payload = {
        title: title.trim(),
        content: content.trim(),
        image_url,
        author_name: username || 'Ẩn danh',
        user_id: userId || null,
        region_name: regionName,
      };

      await axios.post(`${API}/posts`, payload);

      setMessage('Đăng bài thành công');
      setTitle('');
      setContent('');
      setRegionName('');
      setImageFile(null);
      setPreview('');
    } catch (error) {
      console.error('Lỗi đăng bài:', error);
      setMessage(error?.response?.data?.message || 'Đăng bài thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '700px' }}>
      <h2 className="fw-bold mb-4">Đăng bài viết</h2>

      {message && (
        <div
          className={`alert ${message.includes('thành công') ? 'alert-success' : 'alert-danger'}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tiêu đề bài viết"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nội dung</label>
          <textarea
            className="form-control"
            rows="8"
            placeholder="Nhập nội dung bài viết"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
          <label className="form-label">Chọn ảnh từ máy</label>
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

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang đăng...' : 'Đăng bài'}
        </button>
      </form>
    </div>
  );
};

export default AddPostUser;