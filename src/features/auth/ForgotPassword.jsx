import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const resetAll = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setMsg('');
    setDetails([]);
    setLoading(false);
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/account/send-otp', { email });
      setStep(2);
      setMsg('✅ OTP đã được gửi đến email của bạn.');
      setError('');
    } catch {
      setError('❌ Email không tồn tại hoặc lỗi máy chủ.');
      setMsg('');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/account/verify-otp', { email, otp });
      setStep(3);
      setMsg('✅ OTP hợp lệ, mời bạn đặt lại mật khẩu.');
      setError('');
    } catch {
      setError('❌ OTP không đúng hoặc đã hết hạn.');
      setMsg('');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setDetails([]);
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('❌ Mật khẩu xác nhận không khớp.');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/account/reset-password', {
        email,
        otp,
        newPassword,
        confirmPassword
      });
      setMsg('✅ Mật khẩu đã được đặt lại thành công.');
      setTimeout(resetAll, 3000);
    } catch (err) {
      const res = err.response?.data;
      setError(res?.message || 'Không thể đặt lại mật khẩu.');
      if (res?.identityErrors) setDetails(res.identityErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container py-5" style={{ maxWidth: '500px' }}>
        <h4 className="mb-4">🔐 Quên Mật Khẩu</h4>
        {msg && <div className="alert alert-success">{msg}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {details.length > 0 && (
            <ul className="alert alert-warning small">
              {details.map((d, i) => (
                  <li key={i}>{d}</li>
              ))}
            </ul>
        )}

        {step === 1 && (
            <form onSubmit={sendOtp}>
              <label>Email:</label>
              <input
                  type="email"
                  className="form-control mb-3"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
              />
              <button className="btn btn-primary" disabled={loading}>
                {loading ? '⏳ Đang gửi...' : 'Gửi OTP'}
              </button>
            </form>
        )}

        {step === 2 && (
            <form onSubmit={verifyOtp}>
              <label>Mã OTP (đã gửi qua email):</label>
              <input
                  type="text"
                  className="form-control mb-3"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
              />
              <button className="btn btn-warning" disabled={loading}>
                {loading ? '⏳ Đang xác minh...' : 'Xác nhận OTP'}
              </button>
            </form>
        )}

        {step === 3 && (
            <form onSubmit={resetPassword}>
              <label>Mật khẩu mới:</label>
              <input
                  type="password"
                  className="form-control mb-2"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
              />
              <label>Xác nhận mật khẩu mới:</label>
              <input
                  type="password"
                  className="form-control mb-3"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
              />
              <button className="btn btn-success" disabled={loading}>
                {loading ? '⏳ Đang đặt lại...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
        )}
      </div>
  );
};

export default ForgotPassword;
