import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Bạn có chắc muốn đăng xuất?");
        if (!confirmLogout) return;

        localStorage.clear(); // 🔥 gọn hơn

        navigate('/admin-login');
    };

    const linkClass = ({ isActive }) =>
        `nav-link ${isActive ? 'active bg-primary text-white' : ''}`;

    return (
        <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
                <div className="nav">

                    {/* DASHBOARD */}
                    <NavLink to="/admin" className={linkClass}>
                        <div className="sb-nav-link-icon"><i className="fas fa-home"></i></div>
                        Dashboard
                    </NavLink>

                    {/* POSTS */}
                    <div className="sb-sidenav-menu-heading">Bài viết</div>

                    <NavLink to="/admin/posts" className={linkClass}>
                        <div className="sb-nav-link-icon"><i className="fas fa-file-alt"></i></div>
                        Danh sách bài viết
                    </NavLink>

                    <NavLink to="/admin/pending-posts" className={linkClass}>
                        <div className="sb-nav-link-icon"><i className="fas fa-clock"></i></div>
                        Duyệt bài chờ
                    </NavLink>

                    <NavLink to="/admin/add-post" className={linkClass}>
                        <div className="sb-nav-link-icon"><i className="fas fa-plus"></i></div>
                        Thêm bài viết
                    </NavLink>

                    <NavLink to="/admin/add-region" className={linkClass}>
                        <div className="sb-nav-link-icon"><i className="fas fa-map-marker-alt"></i></div>
                        Thêm vùng miền
                    </NavLink>

                    {/* USERS */}
                    <div className="sb-sidenav-menu-heading">Tài khoản</div>

                    <NavLink to="/admin/users" className={linkClass}>
                        <div className="sb-nav-link-icon"><i className="fas fa-user"></i></div>
                        Người dùng
                    </NavLink>

                    {/* LOGOUT */}
                    <button
                        className="nav-link btn text-start text-white"
                        onClick={handleLogout}
                    >
                        <div className="sb-nav-link-icon">
                            <i className="fas fa-sign-out-alt"></i>
                        </div>
                        Đăng xuất
                    </button>

                </div>
            </div>
        </nav>
    );
};

export default AdminSidebar;