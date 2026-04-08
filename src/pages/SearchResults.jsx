import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import HotSidebar from '../components/Post/HotSidebar';

const API = 'http://localhost:3000';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setTotalPages(1);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API}/posts/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage}&pageSize=5`
        );

        setResults(res.data?.items || []);
        setTotalPages(res.data?.totalPages || 1);
      } catch (err) {
        console.error('Lỗi tìm kiếm:', err);
        setResults([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword, currentPage]);

  const handlePageChange = (page) => {
    setSearchParams({ q: keyword, page: page.toString() });
  };

  return (
    <div className="container py-3">
      <h5 className="fw-bold mb-3">
        Kết quả tìm kiếm cho: <span className="text-primary">{keyword}</span>
      </h5>

      <div className="row">
        <div className="col-md-8">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : results.length === 0 ? (
            <p>Không tìm thấy kết quả nào.</p>
          ) : (
            <>
              {results.map((post) => (
                <div className="d-flex mb-4 border-bottom pb-2" key={post.id}>
                  <Link to={`/post/${post.id}`}>
                    <img
                      src={`${API}/images/${post.image_url}`}
                      alt={post.title}
                      style={{ width: 120, height: 80, objectFit: 'cover' }}
                      className="rounded me-3"
                    />
                  </Link>

                  <div>
                    <Link
                      to={`/post/${post.id}`}
                      className="text-dark text-decoration-none fw-bold"
                    >
                      {post.title}
                    </Link>

                    <div className="text-muted small d-flex align-items-center gap-2 mt-1">
                      <span>
                        {post.created_at
                          ? new Date(post.created_at).toLocaleDateString('vi-VN')
                          : ''}
                      </span>
                    </div>

                    <p className="small mb-0 mt-1">
                      Tác giả: {post.author_name || 'Ẩn danh'}
                    </p>
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    {[...Array(totalPages)].map((_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>

        <div className="col-md-4">
          <HotSidebar />
        </div>
      </div>
    </div>
  );
};

export default SearchResults;