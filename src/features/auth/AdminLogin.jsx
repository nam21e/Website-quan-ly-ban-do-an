import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:3000/admin/login', {
                username,
                password,
            });

            const { token, roles, fullName, email } = res.data;
            const roleList = Array.isArray(roles) ? roles : [];

            if (!roleList.includes('Admin')) {
                setError('Bạn không có quyền truy cập trang admin.');
                return;
            }

            localStorage.setItem('admin_token', token || '');
            localStorage.setItem('admin_roles', JSON.stringify(roleList));
            localStorage.setItem('admin_username', username);
            localStorage.setItem('admin_email', email || '');
            localStorage.setItem('admin_fullName', fullName || '');

            navigate('/admin');
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Đăng nhập thất bại. Vui lòng kiểm tra lại.');
            }
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 500 }}>
            <h3 className="mb-4 fw-bold text-center">Đăng Nhập Quản Trị Viên</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Tên đăng nhập</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Đăng nhập
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;