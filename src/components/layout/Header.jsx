import React from 'react';
import { Link } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import { useAuth } from '../../features/auth/useAuth';
import './Header.css';

import banner1 from '../../assets/images/banner.webp';
import banner2 from '../../assets/images/banner5.jpg';
import banner4 from '../../assets/images/banner2.jpg';
import banner5 from '../../assets/images/banner1.jpg';

import avatarImg from "../../assets/images/avatar.png"; // avatar dùng background-image
import BannerSlider from "./BannerSlider";

const Header = () => {
    const { isLoggedIn, username } = useAuth();

    // Danh sách hình banner
    const bannerImages = [banner1, banner2, banner4, banner5];

    return (
        <header>
            {/* Banner tự cuộn nhiều hình */}
            <BannerSlider images={bannerImages} />

            {/* Navigation */}
            <nav className="container mt-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap">

                    {/* ---------------- MENU ---------------- */}
                    <ul className="nav nav-pills main-nav flex-wrap mb-2 mb-md-0">
                        <li className="nav-item">
                            <Link className="nav-link home-tab" to="/">Trang chủ</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link tab-bac" to="/mien-bac">Ẩm Thực Miền Bắc</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link tab-trung" to="/mien-trung">Ẩm Thực Miền Trung</Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link tab-nam" to="/mien-nam">Ẩm Thực Miền Nam</Link>
                        </li>
                    </ul>

                    {/* ---------------- SEARCH + USER ---------------- */}
                    <div className="d-flex align-items-center gap-2 user-tools">

                        {/* SEARCH */}
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
                                style={{ width: 120 }}
                            />
                            <button className="btn btn-sm btn-outline-secondary" type="submit">
                                Tìm
                            </button>
                        </form>

                        {/* NẾU ĐÃ ĐĂNG NHẬP */}
                        {isLoggedIn ? (
                            <>
                                {/* Nút viết bài */}
                                <Link to="/dang-bai" className="text-danger" title="Viết bài">
                                    <FaPen size={20} />
                                </Link>

                                {/* Avatar + username */}
                                <Link
                                    to="/profile"
                                    className="d-flex align-items-center gap-2 text-decoration-none"
                                >
                                    <div
                                        className="avatar-photo"
                                        style={{ backgroundImage: `url(${avatarImg})` }}
                                    />
                                    <span className="text-dark fw-semibold">{username}</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dang-bai" className="text-danger" title="Viết bài">
                                    <FaPen size={20} />
                                </Link>
                                <Link to="/login" className="btn btn-outline-primary btn-sm">
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm text-white">
                                    Đăng ký
                                </Link>
                            </>
                        )}

                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
