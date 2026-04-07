import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import HotSidebar from '../../src/components/Post/HotSidebar';

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("q") || '';
    const currentPage = parseInt(searchParams.get("page")) || 1;

    const [results, setResults] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (keyword.trim()) {
            axios.get(`http://localhost:5094/api/Post/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage}&pageSize=5`)
                .then(res => {
                    setResults(res.data.items);
                    setTotalPages(res.data.totalPages);
                })
                .catch(err => console.error('Lỗi tìm kiếm:', err));
        }
    }, [keyword, currentPage]);

    const handlePageChange = (page) => {
        setSearchParams({ q: keyword, page });
    };

    return (
        <div className="container py-3">
            <h5 className="fw-bold mb-3">
                Kết quả tìm kiếm cho: <span className="text-primary">{keyword}</span>
            </h5>

            <div className="row">
                {/* Kết quả bên trái */}
                <div className="col-md-8">
                    {results.length === 0 ? (
                        <p>Không tìm thấy kết quả nào.</p>
                    ) : (
                        <>
                            {results.map(post => (
                                <div className="d-flex mb-4 border-bottom pb-2" key={post.id}>
                                    <Link to={`/post/${post.id}`}>
                                        <img
                                            src={`http://localhost:5094/images/${post.imageUrl}`}
                                            alt={post.title}
                                            style={{ width: 120, height: 80, objectFit: 'cover' }}
                                            className="rounded me-3"
                                        />
                                    </Link>
                                    <div>
                                        <Link to={`/post/${post.id}`} className="text-dark text-decoration-none fw-bold">{post.title}</Link>
                                        <div className="text-muted small d-flex align-items-center gap-2">
                                            <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                            <span className="border-start ps-2">{post.commentCount} bình luận</span>
                                        </div>
                                        <p className="small mb-0">Tác giả: {post.authorName || 'Ẩn danh'}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Phân trang */}
                            <nav className="mt-4">
                                <ul className="pagination justify-content-center">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </>
                    )}
                </div>

                {/* Sidebar bài viết phổ biến bên phải */}
                <div className="col-md-4">
                    <HotSidebar />
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
