import React, { useState } from 'react';

const Contact = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <div className="container py-5">
            <h2 className="text-center fw-bold mb-4">📩 Liên Hệ Với Chúng Tôi</h2>

            <div className="row">
                {/* Thông tin liên hệ */}
                <div className="col-md-6 mb-4">
                    <h5>🏢 Địa chỉ:</h5>
                    <p>123 Đường Ẩm Thực, Quận 1, TP. Hồ Chí Minh</p>

                    <h5>📞 Số điện thoại:</h5>
                    <p>0977 777 777</p>

                    <h5>📧 Email:</h5>
                    <p>amthucba@example.com</p>

                    <h5>🌐 Bản đồ:</h5>
                    <div style={{ border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden' }}>
                        <iframe
                            title="map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3917577008226!2d106.70042407471958!3d10.778743559174527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3ccf5d867d%3A0x1c625ec43f06e79f!2zNDQgUGjDuiBW4bqhbiBUaOG6p24sIFBoxrDhu51uZyA3LCBRdeG7kWMgMywgSOG7kyBDaMOtbmggTWluaCwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1616145293808!5m2!1sen!2s"
                            width="100%"
                            height="250"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>

                {/* Form liên hệ */}
                <div className="col-md-6">
                    <h5>✍ Gửi tin nhắn:</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Tên của bạn</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Nội dung</label>
                            <textarea
                                className="form-control"
                                rows="5"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary">📨 Gửi liên hệ</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
