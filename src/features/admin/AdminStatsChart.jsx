import React from 'react';

const AdminStatsChart = () => {
  return (
    <div>
      <h2 className="admin-page-title">📊 Thống kê tổng quan</h2>

      <div className="row g-4">
        <div className="col-md-6 col-xl-3">
          <div className="admin-stat-card admin-stat-blue">
            <h5>Tổng bài viết</h5>
            <h2>12</h2>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="admin-stat-card admin-stat-orange">
            <h5>Bài chờ duyệt</h5>
            <h2>4</h2>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="admin-stat-card admin-stat-green">
            <h5>Người dùng</h5>
            <h2>8</h2>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="admin-stat-card admin-stat-red">
            <h5>Vùng miền</h5>
            <h2>3</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsChart;