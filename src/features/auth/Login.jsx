import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // 👈 thêm dòng này

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5094/api/Account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('fullName', data.fullName || '');
        localStorage.setItem('email', data.email || '');
        localStorage.setItem('roles', JSON.stringify(data.roles));
        navigate('/profile');
      } else {
        setError(data.message || 'Đăng nhập thất bại!');
      }
    } catch {
      setError('Lỗi kết nối máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Đăng nhập</h2>

        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Tên đăng nhập hoặc Email */}
          <div className="login-group">
            <label className="login-label">Tên đăng nhập hoặc Email</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="login-input"
              placeholder="Nhập tên đăng nhập hoặc email"
              required
            />
          </div>

          {/* Mật khẩu */}
          <div className="login-group">
            <label className="login-label">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="login-input"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <div className="login-actions">
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? '⏳ Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <a href="/forgot-password" className="login-forgot">
              Quên mật khẩu?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
