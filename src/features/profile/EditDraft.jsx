import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import RegionSelect from '../../components/ui/RegionSelect';
import { useAuth } from '../auth/useAuth';
import { toast } from 'react-toastify'; // 👈 import toast
import 'react-toastify/dist/ReactToastify.css';

const EditDraft = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const [title, setTitle] = useState('');
    const [regionId, setRegionId] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [oldImage, setOldImage] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const imageRef = useRef();

    useEffect(() => {
        axios.get(`/api/post/draft/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => {
                const p = res.data;
                if (p.status !== 'Nháp') return navigate('/profile');
                setTitle(p.title);
                setContent(p.content || '');
                setRegionId(p.regionId);
                setOldImage(p.imageUrl);
                setTags(p.postTags?.map(pt => pt.tag.name) || []);
            })
            .catch(() => navigate('/profile'));
    }, [id, navigate]);

    const handleImageUpload = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleAddTag = (e) => {
        e.preventDefault();
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
        setTagInput('');
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('regionId', regionId);
        formData.append('content', content); // ✅ phải là string
        if (imageFile) formData.append('imageFile', imageFile);
        tags.forEach(tag => formData.append('tags', tag));

        try {
            await axios.put(`/api/post/draft/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Cập nhật bản nháp thành công!');
        } catch (err) {
            console.error("❌ Lỗi chi tiết:", err.response?.data || err.message);
            toast.error('❌ Lỗi khi cập nhật bản nháp!');
        }
    };


    const handlePublish = async () => {
        if (!window.confirm('Bạn có chắc muốn đăng bài này không?')) return;

        try {
            await axios.post(`/api/post/publish/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success('🎉 Bài viết đã được gửi duyệt!');
            navigate('/profile');
        } catch (err) {
            console.error(err);
            toast.error('❌ Lỗi khi đăng bài!');
        }
    };

    function CustomUploadAdapterPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return {
                upload: async () => {
                    const data = new FormData();
                    const file = await loader.file;
                    data.append('file', file);

                    try {
                        const response = await axios.post('/api/post/ckeditor-upload', data, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        });
                        return { default: response.data.url };
                    } catch (error) {
                        console.error('Upload error:', error);
                        throw error;
                    }
                },
            };
        };
    }

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    return (
        <div className="container py-5">
            <h2 className="text-center text-primary fw-bold mb-4">Chỉnh sửa Bài Viết Nháp</h2>

            <form onSubmit={handleUpdate} className="row mt-4">
                <div className="col-md-8 mb-4 editor-wrapper" style={{ minHeight: '500px' }}>
                    <CKEditor
                        editor={ClassicEditor}
                        config={{
                            extraPlugins: [CustomUploadAdapterPlugin],
                            mediaEmbed: { previewsInData: true },
                        }}
                        data={content}
                        onChange={(event, editor) => setContent(editor.getData())}
                    />
                </div>

                <div className="col-md-4">
                    <h5 className="fw-bold mb-3">Thông Tin <span className="text-primary">Bài Viết</span></h5>

                    <div className="mb-3">
                        <label className="form-label">Tiêu Đề Bài Viết</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Vùng Miền</label>
                        <RegionSelect value={regionId} onChange={(e) => setRegionId(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Ảnh hiện tại</label><br />
                        {oldImage && (
                            <img
                                src={`http://localhost:5094/images/${oldImage}`}
                                alt="current"
                                style={{ width: 150 }}
                            />
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Đổi ảnh</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={handleImageUpload}
                            ref={imageRef}
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
                                        onClick={() => handleRemoveTag(tag)}
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
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                        />
                    </div>

                    <div className="d-flex gap-3 mt-4">
                        <button type="submit" className="btn btn-primary flex-fill">💾 Cập nhật</button>
                        <button type="button" className="btn btn-success flex-fill" onClick={handlePublish}>🚀 Đăng bài</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditDraft;
