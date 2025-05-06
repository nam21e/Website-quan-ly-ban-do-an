import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_username');
        navigate('/admin-login');
    };

    return (
        <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
                <div className="nav">
                    <NavLink to="/admin" className="nav-link">
                        <div className="sb-nav-link-icon"><i className="fas fa-home"></i></div>
                        Trang chủ
                    </NavLink>

                    <div className="sb-sidenav-menu-heading">Bài viết</div>
                    <NavLink to="/admin/posts" className="nav-link">
                        <div className="sb-nav-link-icon"><i className="fas fa-file-alt"></i></div>
                        Danh sách bài viết
                    </NavLink>
                    <NavLink to="/admin/add-region" className="nav-link">
                        <div className="sb-nav-link-icon"><i className="fas fa-map-marker-alt"></i></div>
                        Thêm vùng miền
                    </NavLink>
                    <NavLink to="/admin/comments" className="nav-link">
                        <div className="sb-nav-link-icon"><i className="fas fa-comments"></i></div>
                        Quản lý bình luận
                    </NavLink>
                    <div className="sb-sidenav-menu-heading">Tài khoản</div>
                    {/*<NavLink to="/admin/profile" className="nav-link">*/}
                    {/*    <div className="sb-nav-link-icon"><i className="fas fa-user"></i></div>*/}
                    {/*    Thông tin cá nhân*/}
                    {/*</NavLink>*/}
                    <NavLink to="/admin/users" className="nav-link">
                        <div className="sb-nav-link-icon"><i className="fas fa-user"></i></div>
                        Quản Lý Người Dùng
                    </NavLink>

                    <button className="nav-link btn text-start text-white" onClick={handleLogout}>
                        <div className="sb-nav-link-icon"><i className="fas fa-sign-out-alt"></i></div>
                        Đăng xuất
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminSidebar;
