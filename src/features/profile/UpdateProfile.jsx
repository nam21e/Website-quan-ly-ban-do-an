import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ⬅️ Thêm dòng này

const UpdateProfile = () => {
  const [form, setForm] = useState({ email: '', fullName: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ⬅️ Khai báo navigate

  useEffect(() => {
    axios.get('/api/user/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setForm({
          email: res.data.email || '',
          fullName: res.data.fullName || ''
        });
      })
      .catch(() => {
        setError('Không thể tải thông tin người dùng.');
      });
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.post('/api/user/update-profile', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Cập nhật thông tin thành công!');
      localStorage.setItem('email', form.email);
      localStorage.setItem('fullName', form.fullName);
    } catch (err) {
      setError('Cập nhật thất bại!');
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <h4 className="mb-3">Cập nhật thông tin cá nhân</h4>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Họ và tên</label>
          <input
            type="text"
            name="fullName"
            className="form-control"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">💾 Lưu thay đổi</button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/profile')}
          >
            ⬅ Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
