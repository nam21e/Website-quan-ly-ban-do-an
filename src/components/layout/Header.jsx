 import React from 'react';
import { Link } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import { useAuth } from '../../features/auth/useAuth';
import './Header.css';
import banner1 from '../../assets/images/banner.webp';


const Header = () => {
    const { isLoggedIn, username } = useAuth();

    const bannerImages = [banner1,];

    return (
        <header>
            {/* Banner chạy */}
            <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {bannerImages.map((img, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                            <img
                                src={img}
                                alt={`Slide ${index + 1}`}
                                className="d-block w-100"
                                style={{ maxHeight: '320px', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Nút điều khiển trái/phải */}
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#bannerCarousel"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#bannerCarousel"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="container mt-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <ul className="nav nav-pills main-nav flex-wrap mb-2 mb-md-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Trang chủ</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link custom-orange" to="/mien-bac">Ẩm Thực Miền Bắc</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link custom-orange" to="/mien-trung">Ẩm Thực Miền Trung</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link custom-orange" to="/mien-nam">Ẩm Thực Miền Nam</Link>
                        </li>
                    </ul>


                    <div className="d-flex align-items-center gap-3">
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
                                style={{ width: 180 }}
                            />
                            <button className="btn btn-sm btn-outline-secondary" type="submit">Tìm</button>
                        </form>

                        {isLoggedIn ? (
                            <>
                                <Link to="/dang-bai" className="text-danger" title="Viết bài">
                                    <FaPen size={20} />
                                </Link>
                                <Link to="/profile">
                                    <img
                                        src="/images/avatar.png"
                                        alt="avatar"
                                        style={{ width: 32, height: 32, borderRadius: '50%', cursor: 'pointer' }}
                                    />
                                </Link>
                                <Link to="/profile" className="text-dark text-decoration-none fw-semibold">
                                    {username}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dang-bai" className="text-danger" title="Viết bài">
                                    <FaPen size={20} />
                                </Link>
                                <Link to="/login" className="btn btn-outline-primary btn-sm">Đăng nhập</Link>
                                <Link to="/register" className="btn btn-primary btn-sm text-white">Đăng ký</Link>
                            </>
                        )}

                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
