import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { FaUser, FaEnvelope, FaLock, FaIdBadge } from 'react-icons/fa';

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
        localStorage.setItem('fullName', data.fullName);
        localStorage.setItem('email', data.email);
        localStorage.setItem('username', data.username);
        localStorage.setItem('roles', JSON.stringify(data.roles));
        navigate('/');
      } else {
        const message =
          data.message ||
          (Array.isArray(data) ? data[0]?.description : 'Đăng ký thất bại');
        setError(message);
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ!');
    }
  };

  return (
    <div
      className="register-page"
      style={{ backgroundImage: "url('/images/register.jpg')" }}
    >
      <div className="register-card">
        
        {/* Header đẹp */}
        <div className="register-header">
          <div className="register-avatar">
            <FaIdBadge />
          </div>
          <h2>Đăng ký</h2>
          <p>Tạo tài khoản để lưu lại món ăn yêu thích của bạn.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          
          {/* Họ và tên */}
          <div className="form-group-custom">
            <label>Họ và Tên</label>
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="input-custom"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
          </div>

          {/* Tên đăng nhập */}
          <div className="form-group-custom">
            <label>Tên đăng nhập</label>
            <div className="input-icon-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="input-custom"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group-custom">
            <label>Email</label>
            <div className="input-icon-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-custom"
                placeholder="Nhập email"
                required
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="form-group-custom">
            <label>Mật khẩu</label>
            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-custom"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>

          {/* Nhập lại mật khẩu */}
          <div className="form-group-custom">
            <label>Nhập lại mật khẩu</label>
            <div className="input-icon-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input-custom"
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>
          </div>

          {/* Nút đăng ký */}
          <button type="submit" className="btn-register">Đăng ký</button>
        </form>

        <div className="register-footer-text">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
