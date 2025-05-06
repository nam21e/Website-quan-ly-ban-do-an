import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/account/send-otp', { email });
      setMsg('OTP đã được gửi đến email của bạn!');
      setError('');
    } catch (err) {
      setError('Không tìm thấy email hoặc lỗi máy chủ.');
      setMsg('');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <h4>Lấy lại mật khẩu</h4>
      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Nhập Email của bạn:</label>
        <input type="email" className="form-control mb-3" value={email} onChange={e => setEmail(e.target.value)} required />
        <button className="btn btn-primary">Gửi OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
