import React from 'react';
import {Link} from 'react-router-dom';
import notfound from '../assets/images/404.png';

const NotFound = () => {
    return (
        <div className="container text-center py-5">
            <img src={notfound} alt="404 Not Found" className="img-fluid mb-4" style={{maxHeight: '300px'}}/>
            <h1 className="display-4 fw-bold text-danger">404</h1>
            <p className="lead">Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link to="/" className="btn btn-primary mt-3">Quay về trang chủ</Link>
        </div>
    );
};

export default NotFound;
