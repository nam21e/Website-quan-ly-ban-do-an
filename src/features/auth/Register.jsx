import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5094/api/Account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        const message = data.message || (Array.isArray(data) ? data[0]?.description : 'Đăng ký thất bại');
        setError(message);
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ!');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4">Đăng ký</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Họ và Tên</label>
          <input type="text" className="form-control" name="fullName" value={form.fullName} onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <label>Tên đăng nhập</label>
          <input type="text" className="form-control" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <label>Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <label>Mật khẩu</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <label>Nhập lại mật khẩu</label>
          <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-success">Đăng ký</button>
      </form>
    </div>
  );
};

export default Register;
