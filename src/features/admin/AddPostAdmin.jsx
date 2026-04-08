import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';

const API = 'http://localhost:3000';
const FALLBACK_IMAGE = '/images/banner-doc.jpg';

const AddPostAdmin = () => {
  const [title, setTitle] = useState('');
  const [regionName, setRegionName] = useState('');
  const [regions, setRegions] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await axios.get(`${API}/regions`);
        setRegions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Lỗi tải vùng miền:', err);
        setRegions([]);
      }
    };

    fetchRegions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !regionName || !content.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề, vùng miền và nội dung');
      return;
    }

    try {
      setLoading(true);

      let uploadedFilename = null;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const uploadRes = await axios.post(`${API}/upload`, uploadData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        uploadedFilename = uploadRes.data?.filename || null;
      }

      await axios.post(
        `${API}/posts`,
        {
          title: title.trim(),
          content,
          image_url: uploadedFilename,
          author_name: localStorage.getItem('admin_fullName') || 'Admin',
          region_name: regionName,
          status: 'Được Duyệt',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
          },
        }
      );

      alert('✅ Đăng bài thành công!');
      setTitle('');
      setContent('');
      setImageFile(null);
      setRegionName('');
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi đăng bài');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="admin-page-title">➕ Đăng bài viết</h2>

      <div className="admin-panel-box">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-8">
              <div className="mb-3">
                <label className="form-label fw-semibold">Tiêu đề</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tiêu đề..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Nội dung</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={content}
                  onChange={(e, editor) => setContent(editor.getData())}
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">Vùng miền</label>
                <select
                  className="form-select"
                  value={regionName}
                  onChange={(e) => setRegionName(e.target.value)}
                >
                  <option value="">-- Chọn vùng miền --</option>
                  {regions.map((region) => (
                    <option
                      key={region.id}
                      value={region.name || region.region_name}
                    >
                      {region.name || region.region_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Ảnh đại diện</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0] || null)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Xem trước ảnh</label>
                <div className="border rounded p-2 text-center bg-white">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : FALLBACK_IMAGE}
                    alt="preview"
                    style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-success w-100" disabled={loading}>
                {loading ? 'Đang đăng bài...' : '🚀 Đăng bài'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostAdmin;