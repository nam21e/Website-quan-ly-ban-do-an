import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5094/api/comment/admin/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      setComments(res.data);
    } catch (err) {
      console.error('❌ Lỗi khi lấy bình luận:', err);
      alert('Không thể tải danh sách bình luận!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá bình luận này?")) return;
    try {
      await axios.delete(`http://localhost:5094/api/comment/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}` // ✅ FIX dùng đúng token admin
        }
      });
      fetchComments();
    } catch (err) {
      console.error('❌ Lỗi xoá bình luận:', err);
      alert('Xoá không thành công!');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
      <div className="container mt-4">
        <h3 className="mb-3 fw-bold">💬 Quản Lý Bình Luận</h3>

        {loading ? (
            <p>Đang tải bình luận...</p>
        ) : (
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Nội dung</th>
                <th>Tác giả</th>
                <th>Bài viết</th>
                <th>Thời gian</th>
                <th>Hành động</th>
              </tr>
              </thead>
              <tbody>
              {comments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">Không có bình luận nào.</td>
                  </tr>
              ) : (
                  comments.map((c, index) => (
                      <tr key={c.id}>
                        <td>{index + 1}</td>
                        <td>{c.content}</td>
                        <td className="text-primary fw-semibold">
                          {c.user?.fullName || c.user?.userName || 'Ẩn danh'}
                        </td>
                        <td>{c.post?.title || <em className="text-muted">(Đã xoá bài viết)</em>}</td>
                        <td>{new Date(c.createdAt).toLocaleString('vi-VN')}</td>
                        <td>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                            🗑 Xoá
                          </button>
                        </td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
        )}
      </div>
  );
};

export default CommentList;
