import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewPost.css'; // nếu bạn dùng CSS riêng cho bài viết

const ViewPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5094/api/Post/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!post) return <p>Đang tải bài viết...</p>;

  return (
    <div className="container py-4">
      <h3>{post.title}</h3>
      <p><strong>Tác giả:</strong> {post.author}</p>
      <p><strong>Vùng miền:</strong> {post.regionName}</p>
      <p><strong>Ngày đăng:</strong> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>

      <img
        src={`http://localhost:5094/images/${post.imageUrl}`}
        alt={post.title}
        className="img-fluid my-3"
        style={{ maxHeight: '350px' }}
      />

      <hr />

      <div className="ckeditor-wrapper">
        <div
          className="ckeditor-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};

export default ViewPost;
