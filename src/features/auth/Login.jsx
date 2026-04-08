import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Đăng nhập thất bại!');
        return;
      }

      localStorage.setItem('token', data.token || 'fake-token');
      localStorage.setItem('username', data.username || '');
      localStorage.setItem('email', data.email || '');
      localStorage.setItem('roles', JSON.stringify(data.roles || []));
      localStorage.setItem('userId', data.user?.id || '');
      localStorage.setItem('avatar', data.user?.avatar || '');

      navigate('/');
      window.location.reload();
    } catch (err) {
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
          <input
            type="text"
            className="form-control"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <Link to="/forgot-password" className="text-decoration-none small">
            Quên mật khẩu?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;