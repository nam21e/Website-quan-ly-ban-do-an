import React from 'react';

const About = () => {
    return (
        <div className="container py-5">
            <h2 className="fw-bold text-center mb-4">🥢 Giới Thiệu Về Chúng Tôi</h2>

            <div className="row align-items-center">
                <div className="col-md-6 mb-4">
                    <img
                        src="../assets/images/logo.png"
                        alt="Ẩm thực Việt Nam"
                        className="img-fluid rounded shadow"
                    />
                </div>

                <div className="col-md-6">
                    <p style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                        <strong>WebAmThucBaMien</strong> là nền tảng chia sẻ, khám phá và lưu giữ tinh hoa ẩm thực Việt Nam từ Bắc vào Nam.
                        Chúng tôi không chỉ mang đến những công thức nấu ăn truyền thống, mà còn là nơi để mọi người cùng chia sẻ tình yêu với món ngon quê nhà.
                    </p>
                    <p style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                        Với hàng trăm bài viết, công thức, bí quyết nấu ăn và đánh giá món ăn thực tế từ cộng đồng, website hướng đến việc
                        <strong> kết nối ẩm thực – kết nối văn hoá – kết nối con người</strong>.
                    </p>
                    <p style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                        Cảm ơn bạn đã đồng hành cùng chúng tôi trong hành trình gìn giữ và lan tỏa văn hoá ẩm thực Việt!
                    </p>
                </div>
            </div>

            <hr className="my-5" />

            <div className="text-center">
                <h5 className="fw-bold">🎯 Sứ Mệnh</h5>
                <p style={{ maxWidth: 700, margin: '0 auto', fontSize: '1.1rem' }}>
                    Trở thành cổng thông tin ẩm thực hàng đầu tại Việt Nam, nơi mỗi người đều có thể chia sẻ và tìm thấy món ăn yêu thích nhất của mình.
                </p>
            </div>
        </div>
    );
};

export default About;
