import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const res = await axios.get('http://localhost:5094/api/UserManagement', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('admin_token')}`
            }
        });
        setUsers(res.data);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xoá người dùng này?")) return;
        await axios.delete(`http://localhost:5094/api/UserManagement/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
        });
        fetchUsers();
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
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u, i) => (
                    <tr key={u.id}>
                        <td>{i + 1}</td>
                        <td>{u.userName}</td>
                        <td>{u.email}</td>
                        <td>{u.emailConfirmed ? '✔️' : '❌'}</td>
                        <td>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>🗑 Xoá</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserList;
