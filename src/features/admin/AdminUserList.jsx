import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [bannedIds, setBannedIds] = useState([]);
    const token = localStorage.getItem('admin_token');

    const fetchUsers = async () => {
        try {
            const [userRes, bannedRes] = await Promise.all([
                axios.get('http://localhost:5094/api/UserManagement', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5094/api/UserManagement/banned-comment-users', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setUsers(userRes.data);
            setBannedIds(bannedRes.data.map(u => u.id));
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu người dùng:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xoá người dùng này?")) return;
        try {
            await axios.delete(`http://localhost:5094/api/UserManagement/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            console.error("Lỗi khi xoá người dùng:", error);
        }
    };

    const handleToggleBan = async (id) => {
        try {
            await axios.post(`http://localhost:5094/api/UserManagement/toggle-comment-ban/${id}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            console.error("Lỗi khi đổi trạng thái cấm:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h3>📋 Quản lý người dùng</h3>
            <table className="table table-bordered mt-3">
                <thead className="table-light">
                <tr>
                    <th>#</th>
                    <th>Tên đăng nhập</th>
                    <th>Email</th>
                    <th>Xác thực</th>
                    <th>Bình luận</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u, i) => {
                    const isBanned = bannedIds.includes(u.id);
                    return (
                        <tr key={u.id}>
                            <td>{i + 1}</td>
                            <td>{u.userName}</td>
                            <td>{u.email}</td>
                            <td>{u.emailConfirmed ? '✔️' : '❌'}</td>
                            <td>
                                    <span className={`badge ${isBanned ? 'bg-danger' : 'bg-success'}`}>
                                        {isBanned ? '🛑 Cấm' : '✅ Bình thường'}
                                    </span>
                            </td>
                            <td className="d-flex gap-2">
                                <button
                                    className={`btn btn-sm ${isBanned ? 'btn-success' : 'btn-warning'}`}
                                    onClick={() => handleToggleBan(u.id)}
                                >
                                    {isBanned ? '🔓 Mở cấm' : '🔒 Cấm'}
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>🗑 Xoá</button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserList;
