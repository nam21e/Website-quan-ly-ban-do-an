import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="custom-footer text-white pt-5">
      <div className="container">
        <div className="row">
          {/* Giới thiệu */}
          <div className="col-md-4 mb-4">
            <h6 className="footer-title">GIỚI THIỆU</h6>
            <hr className="footer-line" />
            <p className="footer-text">
              WebAmThucBaMien là trang web cập nhật thông tin mới nhất về ẩm thực Việt Nam và Thế Giới. 
              Chia sẻ kinh nghiệm nấu ăn ngon dành cho gia đình.
            </p>
          </div>

          {/* Bản quyền */}
          <div className="col-md-4 mb-4">
            <h6 className="footer-title">BẢN QUYỀN NỘI DUNG</h6>
            <hr className="footer-line" />
            <img
              src="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=somecode"
              alt="DMCA Protected"
              style={{ marginTop: 10 }}
            />
          </div>

          {/* Tìm kiếm */}
          <div className="col-md-4 mb-4">
            <h6 className="footer-title">TÌM KIẾM</h6>
            <hr className="footer-line" />
            <div className="d-flex">
              <input
                type="text"
                className="form-control rounded-0"
                placeholder="Search here …"
              />
              <button className="btn btn-orange rounded-0">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom text-center py-3">
        © Copyright 2011-2025 <span className="text-warning fw-bold"></span>
      </div>
    </footer>
  );
};

export default Footer;
