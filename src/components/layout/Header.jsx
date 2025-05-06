import React from 'react';
import {Link} from 'react-router-dom';
import './Header.css';
import {useAuth} from '../../features/auth/useAuth';
import banner from '../../assets/images/banner.gif';
import {FaPen} from 'react-icons/fa';
import logo from '../../assets/images/logo.png'
import avatar from '../../assets/images/avatar.png'

const Header = () => {
    const {isLoggedIn, username} = useAuth();

    return (
        <header>
            {/* Top bar */}
            <div className="top-bar text-white py-1">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <small>
                                <Link to="/terms" className="text-white text-decoration-none me-3">Điều khoản</Link>
                                <Link to="/policy" className="text-white text-decoration-none me-3">Chính sách</Link>
                                <Link to="/gioi-thieu" className="text-white text-decoration-none me-3">Giới thiệu</Link>
                                <Link to="/lien-he" className="text-white text-decoration-none">Liên hệ</Link>
                            </small>
                        </div>

                        <div className="col-md-6 text-md-end text-start mt-2 mt-md-0">
                            <small>
                                📧 email.com@gmail.com &nbsp; 📞 0977777777 &nbsp;
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                                   className="text-white me-2">📘</a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                   className="text-white me-2">🐦</a>
                                <a href="mailto:email.com@gmail.com" className="text-white">📩</a>
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main nav */}
            <div className="main-nav bg-white border-bottom py-3">
                <div className="container">
                    <div className="row align-items-center">
                        {/* Logo */}
                        <div className="col-md-3 d-flex align-items-center">
                            <img src={logo} alt="Logo" style={{height: 40, marginRight: 10}}/>
                            <h4 className="mb-0 fw-bold text-danger">THE <span className="text-dark">FOODS</span></h4>
                        </div>

                        {/* Banner */}
                        <div className="col-md-9">
                            <img
                                src={banner}
                                alt="Tour quảng cáo"
                                className="img-fluid w-100"
                                style={{maxHeight: 60, objectFit: 'contain'}}
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="container mt-3">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        {/* Menu trái */}
                        <ul className="nav nav-pills flex-wrap mb-2 mb-md-0">
                            <li className="nav-item"><Link className="nav-link active" to="/">Trang chủ</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="#">Ăn ngon</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="#">Tin tức</Link></li>
                        </ul>

                        {/* Thanh tìm kiếm + Người dùng */}
                        <div className="d-flex align-items-center gap-3">
                            {/* 🔍 Tìm kiếm */}
                            <form
                                className="d-flex"
                                onSubmit={e => {
                                    e.preventDefault();
                                    const keyword = e.target.keyword.value.trim();
                                    if (keyword) window.location.href = `/search?q=${keyword}`;
                                }}
                            >
                                <input
                                    name="keyword"
                                    type="text"
                                    className="form-control form-control-sm me-2"
                                    placeholder="Tìm bài viết..."
                                    style={{width: 180}}
                                />
                                <button className="btn btn-sm btn-outline-secondary" type="submit">Tìm</button>
                            </form>

                            {/* Đăng bài + Avatar/Đăng nhập */}
                            {isLoggedIn ? (
                                <>
                                    <Link to="/dang-bai" className="text-danger" title="Viết bài">
                                        <FaPen size={20}/>
                                    </Link>
                                    <img src={avatar} alt="avatar"
                                         style={{width: 32, height: 32, borderRadius: '50%'}}/>
                                    <Link to="/profile" className="text-dark text-decoration-none fw-semibold">
                                        {username}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/dang-bai" className="text-danger" title="Viết bài">
                                        <FaPen size={20}/>
                                    </Link>
                                    <Link to="/login" className="btn btn-outline-primary btn-sm">Đăng nhập</Link>
                                    <Link to="/register" className="btn btn-primary btn-sm text-white">Đăng ký</Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

            </div>
        </header>
    );
};

export default Header;
