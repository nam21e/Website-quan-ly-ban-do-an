import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [regionId, setRegionId] = useState('');
    const [regions, setRegions] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [editorReady, setEditorReady] = useState(false);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postRes = await axios.get(`http://localhost:5094/api/Post/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const post = postRes.data;
                setTitle(post.title || '');
                setContent(post.content || '');
                setAuthor(post.user?.userName || 'Ẩn danh');
                setRegionId(post.regionId || '');
                setImageUrl(post.imageUrl || '');
                setTags(post.postTags?.map(pt => pt.tag.name) || []);

                const regionsRes = await axios.get('http://localhost:5094/api/Region');
                setRegions(regionsRes.data);

                setEditorReady(true);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', id);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('regionId', regionId);
        if (imageFile) {
            formData.append('imageFile', imageFile);
        } else {
            formData.append('imageUrl', imageUrl);
        }
        tags.forEach(tag => formData.append('tags', tag));

        try {
            await axios.put('http://localhost:5094/api/Post/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('admin_token')}`
                }
            });
            alert('Cập nhật thành công!');
            navigate('/admin/posts');
        } catch (err) {
            console.error("Lỗi khi cập nhật bài viết:", err.response?.data || err.message);
            alert('Lỗi khi cập nhật bài viết!');
        }
    };

    return (
        <div className="container-fluid">
            <h3 className="mb-4 fw-bold">📝 Xem / Sửa Bài Viết</h3>
            <form onSubmit={handleSubmit} className="row">
                <div className="col-md-8">
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tiêu đề</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Nội dung bài viết</label>
                        {editorReady ? (
                            <CKEditor
                                editor={ClassicEditor}
                                data={content}
                                config={{ mediaEmbed: { previewsInData: true } }}
                                onChange={(event, editor) => setContent(editor.getData())}
                            />
                        ) : (
                            <div className="text-muted">⏳ Đang tải trình soạn thảo...</div>
                        )}
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="mb-3">
                        <label className="form-label">Tác giả</label>
                        <input
                            type="text"
                            className="form-control"
                            value={author}
                            disabled
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Chọn vùng miền</label>
                        <select
                            className="form-select"
                            value={regionId}
                            onChange={(e) => setRegionId(e.target.value)}
                            required
                        >
                            <option value="">-- Chọn vùng --</option>
                            {regions.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Ảnh đại diện</label>
                        <div className="mb-2">
                            {imageFile ? (
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Ảnh mới"
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '200px' }}
                                />
                            ) : imageUrl && (
                                <img
                                    src={`http://localhost:5094/images/${imageUrl}`}
                                    alt="Ảnh bài viết"
                                    className="img-fluid rounded"
                                    style={{ maxHeight: '200px' }}
                                />
                            )}
                        </div>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Tags (nhấn Enter để thêm)</label>
                        <div className="d-flex gap-2 flex-wrap mb-2">
                            {tags.map((tag, i) => (
                                <span key={i} className="badge bg-info text-dark px-2 py-1">
                  {tag}
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white btn-sm ms-2"
                                        onClick={() => setTags(tags.filter(t => t !== tag))}
                                    ></button>
                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập tag và nhấn Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const trimmed = tagInput.trim();
                                    if (trimmed && !tags.includes(trimmed)) {
                                        setTags([...tags, trimmed]);
                                    }
                                    setTagInput('');
                                }
                            }}
                        />
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">📅 Cập nhật</button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                            ⬅ Quay lại
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditPost;
