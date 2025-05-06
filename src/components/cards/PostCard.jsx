import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ id, image, title, category, author, date }) => {
  return (
    <Link to={`/post/${id}`} className="text-decoration-none">
      <div className="post-card position-relative text-white overflow-hidden rounded mb-4">
        <img
          src={image}
          alt={title}
          className="img-fluid w-100"
          style={{ height: 300, objectFit: 'cover' }}
        />
        <div className="post-overlay position-absolute bottom-0 start-0 p-3 w-100 bg-gradient">
          <span className="badge bg-light text-dark mb-2">{category}</span>
          <h5 className="fw-bold">{title}</h5>
          <p className="mb-0">
            <small className="text-white-50 fw-semibold">{author}</small>
            <span className="mx-2">-</span>
            <small className="text-white-50">{date}</small>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
