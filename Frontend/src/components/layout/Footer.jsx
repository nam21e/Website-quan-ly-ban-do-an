import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="custom-footer text-white pt-5">
      <div className="container">
        <div className="row">
          {/* Giới thiệu */}
          <div className="col-md-3 mb-4">
            <h6 className="footer-title">GIỚI THIỆU</h6>
            <hr className="footer-line" />
            <p className="footer-text">
              <span role="img" aria-label="food">🍽️</span> WebAmThucBaMien là trang web cập nhật thông tin mới nhất về ẩm thực Việt Nam. <br />
              <span role="img" aria-label="cook">👩‍🍳</span> Chia sẻ kinh nghiệm nấu ăn ngon dành cho gia đình.
            </p>
          </div>

          {/* Giờ hoạt động */}
          <div className="col-md-3 mb-4">
            <h6 className="footer-title">⏰ GIỜ HOẠT ĐỘNG</h6>
            <hr className="footer-line" />
            <ul className="footer-text list-unstyled">
              <li>Thứ 2 - Thứ 6: 08:00 - 20:00</li>
              <li>Thứ 7 & Chủ Nhật: 09:00 - 18:00</li>
              <li>Hỗ trợ trực tuyến: 24/7</li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="col-md-3 mb-4">
            <h6 className="footer-title">LIÊN HỆ</h6>
            <hr className="footer-line" />
            <p className="footer-text mb-1">📍 Địa chỉ: 123 Lê Văn Việt, TP.HCM</p>
            <p className="footer-text mb-1">📞 Hotline: 0123 456 789</p>
            <p className="footer-text mb-3">✉️ Email: amthuc3mien@gmail.com</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* Tìm kiếm */}
          <div className="col-md-3 mb-4">
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

      {/* Bản quyền */}
      <div className="footer-bottom text-center py-3">
        ©2011-2025 <span className="text-warning fw-bold">WebAmThucBaMien</span>
      </div>
    </footer>
  );
};

export default Footer;
