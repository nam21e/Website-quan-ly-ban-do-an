import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [regions, setRegions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5094/api/Post/admin/all', {
                headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
            });
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRegions = async () => {
        try {
            const res = await axios.get('http://localhost:5094/api/Region');
            setRegions(res.data);
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        fetchPosts();
        fetchRegions();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xoá bài viết này?')) return;
        try {
            await axios.delete(`http://localhost:5094/api/Post/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
            });
            alert('Xoá thành công!');
            fetchPosts();
        } catch (err) {
            console.error(err);
            alert('Lỗi khi xoá bài viết!');
        }
    };

    const filteredPosts = posts.filter(post => {
        if (post.status === 'Nháp') return false; // ẩn bài viết nháp
        const matchTitle = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRegion = selectedRegion ? post.regionName === selectedRegion : true;
        return matchTitle && matchRegion;
    });


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">📋 Danh Sách Bài Viết</h3>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo tiêu đề..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <select
                        className="form-select form-select-sm"
                        style={{ width: '180px', height: '39px', display: 'inline-block' }}
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                        <option value="">-- Lọc theo vùng miền --</option>
                        {regions.map(region => (
                            <option key={region.id} value={region.name}>{region.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Ảnh</th>
                        <th>Tiêu Đề</th>
                        <th>Tác Giả</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPosts.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">Không có bài viết nào.</td>
                        </tr>
                    ) : (
                        currentPosts.map((post, index) => (
                            <tr key={post.id}>
                                <td>{indexOfFirstPost + index + 1}</td>
                                <td>
                                    <img
                                        src={`http://localhost:5094/images/${post.imageUrl}`}
                                        alt={post.title}
                                        style={{ width: 70, height: 50, objectFit: 'cover' }}
                                        className="rounded"
                                    />
                                </td>
                                <td>{post.title}</td>
                                <td className="text-primary fw-semibold">{post.author || 'Ẩn danh'}</td>
                                <td>
                                    <span className={`badge ${
                                        post.status === 'Chờ Duyệt' ? 'bg-warning text-dark' :
                                            post.status === 'Bị Từ Chối' ? 'bg-danger' :
                                                post.status === 'Được Duyệt' ? 'bg-success' :
                                                    'bg-secondary'
                                    }`}>
                                        {post.status}
                                    </span>
                                </td>
                                <td>
                                    {post.status === 'Chờ Duyệt' ? (
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => navigate('/admin/pending-posts')}
                                        >
                                            ✅ Duyệt
                                        </button>
                                    ) : post.status === 'Bị Từ Chối' ? (
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            <FaTrash className="me-1" /> Xoá
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => navigate(`/admin/edit-post/${post.id}`)}
                                            >
                                                ✏️ Xem / Sửa
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger ms-2"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                <FaTrash className="me-1" /> Xoá
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-3">
                    <ul className="pagination">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                                <button onClick={() => paginate(idx + 1)} className="page-link">
                                    {idx + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default PostList;
