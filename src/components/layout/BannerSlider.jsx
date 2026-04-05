import React, { useEffect, useState } from "react";
import "./Header.css";

const BannerSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // luôn khai báo hook trước, không return sớm
  const hasImages = images && images.length > 0;

  // Tự động đổi hình mỗi 4 giây
  useEffect(() => {
    if (!hasImages) return; // nếu không có ảnh thì không setInterval

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [hasImages, images.length]);

  // Không có hình thì không render gì
  if (!hasImages) return null;

  return (
    <div className="banner-slider">
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`banner-${idx + 1}`}
          className={`banner-slide ${idx === currentIndex ? "active" : ""}`}
        />
      ))}
    </div>
  );
};

export default BannerSlider;
