import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const API = 'http://localhost:3000';
const FALLBACK_IMAGE = '/images/banner-doc.jpg';

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
            const res = await axios.get(`${API}/posts/admin/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
                },
            });
            setPosts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Lỗi lấy danh sách bài viết:', err);
            setPosts([]);
        }
    };

    const fetchRegions = async () => {
        try {
            const res = await axios.get(`${API}/regions`);
            setRegions(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Lỗi lấy vùng miền:', err);
            setRegions([]);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchRegions();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedRegion]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Bạn có chắc muốn xoá bài viết này?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API}/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
                },
            });

            alert('Xoá thành công!');
            fetchPosts();
        } catch (err) {
            console.error('Lỗi khi xoá bài viết:', err);
            alert('Lỗi khi xoá bài viết!');
        }
    };

    const handleApprove = async (id) => {
        const confirmApprove = window.confirm('Bạn có chắc muốn duyệt bài viết này?');
        if (!confirmApprove) return;

        try {
            await axios.put(
                `${API}/posts/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
                    },
                }
            );

            alert('Duyệt bài thành công!');
            fetchPosts();
        } catch (err) {
            console.error('Lỗi khi duyệt bài viết:', err);
            alert('Lỗi khi duyệt bài viết!');
        }
    };

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            if (post.status === 'Nháp') return false;

            const title = (post.title || '').toLowerCase();
            const regionName = post.region_name || post.regionName || '';

            const matchTitle = title.includes(searchTerm.toLowerCase());
            const matchRegion = selectedRegion ? regionName === selectedRegion : true;

            return matchTitle && matchRegion;
        });
    }, [posts, searchTerm, selectedRegion]);

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

            <div className="row mb-3 g-2">
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
                        className="form-select"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                        <option value="">-- Lọc theo vùng miền --</option>
                        {regions.map((region) => (
                            <option
                                key={region.id}
                                value={region.name || region.region_name}
                            >
                                {region.name || region.region_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Ảnh</th>
                        <th>Tiêu Đề</th>
                        <th>Tác Giả</th>
                        <th>Vùng miền</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>

                <tbody>
                    {currentPosts.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">
                                Không có bài viết nào.
                            </td>
                        </tr>
                    ) : (
                        currentPosts.map((post, index) => {
                            const regionName = post.region_name || post.regionName || 'Chưa có';
                            const authorName = post.author_name || post.authorName || post.author || 'Ẩn danh';
                            const imageUrl = post.image_url || post.imageUrl || '';
                            const status = post.status || 'Không xác định';

                            return (
                                <tr key={post.id}>
                                    <td>{indexOfFirstPost + index + 1}</td>

                                    <td>
                                        <img
                                            src={imageUrl ? `${API}/images/${imageUrl}` : FALLBACK_IMAGE}
                                            alt={post.title}
                                            style={{ width: 70, height: 50, objectFit: 'cover' }}
                                            className="rounded"
                                            onError={(e) => {
                                                e.currentTarget.src = FALLBACK_IMAGE;
                                            }}
                                        />
                                    </td>

                                    <td>{post.title}</td>

                                    <td className="text-primary fw-semibold">
                                        {authorName}
                                    </td>

                                    <td>{regionName}</td>

                                    <td>
                                        <span
                                            className={`badge ${
                                                status === 'Chờ Duyệt'
                                                    ? 'bg-warning text-dark'
                                                    : status === 'Bị Từ Chối'
                                                    ? 'bg-danger'
                                                    : status === 'Được Duyệt'
                                                    ? 'bg-success'
                                                    : 'bg-secondary'
                                            }`}
                                        >
                                            {status}
                                        </span>
                                    </td>

                                    <td>
                                        {status === 'Chờ Duyệt' ? (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleApprove(post.id)}
                                            >
                                                ✅ Duyệt
                                            </button>
                                        ) : status === 'Bị Từ Chối' ? (
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                <FaTrash className="me-1" />
                                                Xoá
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
                                                    <FaTrash className="me-1" />
                                                    Xoá
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-3">
                    <ul className="pagination">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <li
                                key={idx}
                                className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}
                            >
                                <button
                                    onClick={() => paginate(idx + 1)}
                                    className="page-link"
                                >
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