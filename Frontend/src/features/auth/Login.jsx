import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4">Đăng nhập</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Tên đăng nhập hoặc Email</label>
          <input type="text" className="form-control" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div className="form-group mb-3">
          <label>Mật khẩu</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Đang đăng nhập...' : 'Đăng nhập'}
          </button>
          <a href="/forgot-password" className="text-decoration-none small">Quên mật khẩu?</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
