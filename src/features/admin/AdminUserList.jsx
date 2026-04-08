import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/users`);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Lỗi tải user:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm('Bạn có chắc muốn xóa user?');
    if (!ok) return;

    try {
      await axios.delete(`${API}/users/${id}`);
      alert('Xóa thành công!');
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Lỗi xóa user!');
    }
  };

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">📋 Quản lý người dùng</h3>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>{u.username || u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(u.id)}
                    >
                      Xóa
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

export default AdminUserList;