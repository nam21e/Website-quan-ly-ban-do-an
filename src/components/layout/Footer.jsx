import React from 'react';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaTwitter, FaUtensils, FaBookOpen } from 'react-icons/fa';
import { FaHeadset } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer-container">

      {/* ==== Thanh cam phía trên ==== */}
      <div className="footer-top-banner">
        <div className="container footer-top-inner">

          {/* Hỗ trợ */}
          <div className="footer-top-item">
            <FaHeadset className="top-icon" />
            <div>
              <h4>Hỗ trợ 24/7</h4>
              <p>Liên hệ chúng tôi bất cứ lúc nào</p>
            </div>
          </div>

          {/* Gợi ý món ăn */}
          <div className="footer-top-item">
            <FaUtensils className="top-icon" />
            <div>
              <h4>Gợi ý món ăn</h4>
              <p>Đề xuất món ngon phù hợp khẩu vị</p>
            </div>
          </div>

          {/* Công thức nấu ăn */}
          <div className="footer-top-item">
            <FaBookOpen className="top-icon" />
            <div>
              <h4>Công thức nấu ăn</h4>
              <p>Hướng dẫn chi tiết từng bước</p>
            </div>
          </div>

        </div>
      </div>

      {/* ==== Nội dung chính ==== */}
      <div className="container mt-4">
        <div className="row">

          {/* Giới thiệu */}
          <div className="col-md-3 mb-4">
            <h6 className="footer-title">GIỚI THIỆU</h6>
            <hr className="footer-line" />
            <p className="footer-text">
              🍽️ WebAmThucBaMien là trang web cập nhật thông tin mới nhất về ẩm thực Việt Nam.
              <br />
              👩‍🍳 Chia sẻ kinh nghiệm nấu ăn ngon dành cho gia đình.
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

            <div className="footer-social">
              <FaFacebookF className="social-icon facebook" />
              <FaInstagram className="social-icon instagram" />
              <FaTwitter className="social-icon twitter" />
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
      <div className="footer-bottom">
        ©2011–2025 <strong>WebAmThucBaMien</strong>
      </div>
    </footer>
  );
};

export default Footer;
