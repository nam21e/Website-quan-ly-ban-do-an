// src/components/admin/AdminTopbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminTopbar = ({ toggleSidebar }) => {
    const adminFullName = localStorage.getItem('admin_fullName');
    const adminUsername = localStorage.getItem('admin_username');

    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <Link className="navbar-brand ps-3" to="/">Admin Ẩm Thực</Link>

            <button
                className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
                id="sidebarToggle"
                onClick={toggleSidebar}
            >
                <i className="fas fa-bars"></i>
            </button>

            <div className="ms-auto d-flex align-items-center text-white me-4">
                Xin chào,&nbsp;
                <strong>{adminFullName || adminUsername || 'Quản trị viên'}</strong>
            </div>
        </nav>
    );
};

export default AdminTopbar;
