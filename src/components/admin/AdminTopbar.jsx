import React from 'react';

const AdminTopbar = ({ toggleSidebar }) => {
  const fullName = localStorage.getItem('admin_fullName') || 'Admin';

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark">
      <a className="navbar-brand ps-3" href="/admin">
        Admin Ẩm Thực
      </a>

      <button
        className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0 text-white"
        onClick={toggleSidebar}
      >
        <i className="fas fa-bars"></i>
      </button>

      <div className="ms-auto me-3 text-white fw-semibold">
        Xin chào, <span className="text-warning">{fullName}</span>
      </div>
    </nav>
  );
};

export default AdminTopbar;