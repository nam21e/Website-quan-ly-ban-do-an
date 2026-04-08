import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import AdminTopbar from '../admin/AdminTopbar';
import '../../assets/styles/sb-admin.css';

const AdminLayout = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`sb-nav-fixed ${isSidebarCollapsed ? 'sb-sidenav-toggled' : ''}`}>
      <AdminTopbar toggleSidebar={toggleSidebar} />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <AdminSidebar />
        </div>
        <div id="layoutSidenav_content">
          <main className="p-4">
            <div className="admin-panel-box">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;