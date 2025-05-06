import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Modal, Button} from 'react-bootstrap';
import Swal from 'sweetalert2';

const PendingPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5094/api/PostApproval/pending', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('admin_token')}`
                }
            });
            setPosts(res.data);
        } catch (err) {
            console.error('Lỗi khi tải danh sách:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:5094/api/PostApproval/approve/${id}`, null, {
                headers: {Authorization: `Bearer ${localStorage.getItem('admin_token')}`}
            });
            fetchPosts();
        } catch (err) {
            console.error('Lỗi khi duyệt bài viết:', err);
        }
    };

    const handleReject = async (id) => {
        const {value: reason} = await Swal.fire({
            title: 'Nhập lý do từ chối',
            input: 'textarea',
            inputLabel: 'Lý do',
            inputPlaceholder: 'Nhập lý do từ chối bài viết...',
            inputAttributes: {
                'aria-label': 'Nhập lý do từ chối bài viết'
            },
            showCancelButton: true,
            confirmButtonText: 'Gửi từ chối',
            cancelButtonText: 'Huỷ'
        });

        if (reason) {
            try {
                await axios.post(`http://localhost:5094/api/PostApproval/reject/${id}`, {reason}, {
                    headers: {Authorization: `Bearer ${localStorage.getItem('admin_token')}`}
                });
                Swal.fire('Đã từ chối!', 'Bài viết đã bị từ chối.', 'success');
                fetchPosts();
            } catch (err) {
                console.error('Lỗi khi từ chối bài viết:', err);
                Swal.fire('Lỗi!', 'Không thể từ chối bài viết.', 'error');
            }
        }
    };

    const handleView = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    return (
        <div className="container-fluid">
            <h4 className="mb-4 fw-bold">🕒 Bài Viết Chờ Duyệt</h4>

            <button className="btn btn-outline-primary mb-3" onClick={fetchPosts}>
                🔄 Tải lại danh sách
            </button>
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : posts.length === 0 ? (
                <div className="alert alert-info">Không có bài viết nào chờ duyệt.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Hình Ảnh</th>
                            <th>Tiêu Đề</th>
                            <th>Tác Giả</th>
                            <th>Ngày Tạo</th>
                            <th>Hành Động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {posts.map((post, index) => (
                            <tr key={post.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img
                                        src={`http://localhost:5094/images/${post.imageUrl}`}
                                        alt="Ảnh bài viết"
                                        style={{width: 70, height: 50, objectFit: 'cover', borderRadius: 5}}
                                    />
                                </td>
                                <td>{post.title}</td>
                                <td className="text-primary fw-semibold">{post.authorName}</td>
                                <td>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => handleView(post)}
                                        >
                                            ✏ Xem nội dung
                                        </button>
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => handleApprove(post.id)}
                                        >
                                            ✔ Duyệt
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleReject(post.id)}
                                        >
                                            ✖ Từ chối
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL XEM CHI TIẾT */}
            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>📄 {selectedPost?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{maxHeight: '80vh', overflowY: 'auto'}}>
                    <div className="mb-2"><strong>Tác giả:</strong> {selectedPost?.authorName || 'Ẩn danh'}</div>
                    <div className="mb-2"><strong>Ngày
                        tạo:</strong> {selectedPost?.createdAt ? new Date(selectedPost.createdAt).toLocaleDateString('vi-VN') : ''}
                    </div>

                    {selectedPost?.imageUrl && (
                        <div className="mb-3">
                            <strong>Ảnh đại diện:</strong><br/>
                            <img
                                src={`http://localhost:5094/images/${selectedPost.imageUrl}`}
                                alt="Ảnh đại diện"
                                className="img-fluid rounded mt-2"
                                style={{maxHeight: '250px'}}
                            />
                        </div>
                    )}
                    <hr/>
                    <div
                        className="post-preview-content"
                        dangerouslySetInnerHTML={{__html: selectedPost?.content || ''}}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PendingPosts;
