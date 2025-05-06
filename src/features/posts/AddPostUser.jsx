import React, { useState, useRef, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import RegionSelect from '../../components/ui/RegionSelect';
import { useAuth } from '../auth/useAuth';
import { Link, Navigate } from 'react-router-dom';
import '../../assets/styles/editor.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPostUser = () => {
    const [title, setTitle] = useState('');
    const [regionId, setRegionId] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [editorReady, setEditorReady] = useState(false);
    const imageInputRef = useRef();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        setEditorReady(true);
    }, []);

    if (!isLoggedIn) return <Navigate to="/login" replace />;

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitForm('/api/post/upload', '🎉 Đăng bài thành công! Chờ duyệt từ admin.');
    };

    const handleSaveDraft = async () => {
        await submitForm('/api/post/draft', 'Lưu bản nháp thành công!');
    };

    const submitForm = async (url, successMessage) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('regionId', regionId);
        formData.append('imageFile', imageFile);
        formData.append('content', content);
        formData.append('author', localStorage.getItem('username'));
        tags.forEach(tag => formData.append('tags', tag));

        try {
            await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(successMessage);
            setTitle('');
            setRegionId('');
            setImageFile(null);
            setContent('');
            setTags([]);
            if (imageInputRef.current) imageInputRef.current.value = null;
        } catch (error) {
            console.error('Lỗi:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || '❌ Đăng bài thất bại. Vui lòng thử lại!');
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

    return (
        <div className="container py-5">
            <h2 className="text-center text-success fw-bold mb-4">Viết Bài Mới</h2>
            <p className="text-center text-muted">
                Bạn Đang Xem: <Link to="/">Trang Chủ</Link> &gt; <Link to="/profile">Tài Khoản</Link> &gt;{' '}
                <span className="fw-semibold">Viết Bài Mới</span>
            </p>

            <form onSubmit={handleSubmit} className="row mt-4">
                <div className="col-md-8 mb-4 editor-wrapper" style={{ minHeight: '500px' }}>
                    {editorReady && (
                        <CKEditor
                            editor={ClassicEditor}
                            config={{
                                extraPlugins: [CustomUploadAdapterPlugin],
                                mediaEmbed: { previewsInData: true },
                                toolbar: { shouldNotGroupWhenFull: true },
                                htmlSupport: {
                                    allow: [
                                        { name: 'p', attributes: true, classes: true, styles: true },
                                        { name: 'h2', attributes: true },
                                        { name: 'h3', attributes: true },
                                        { name: 'ul', attributes: true },
                                        { name: 'ol', attributes: true },
                                        { name: 'li', attributes: true },
                                        { name: 'strong', attributes: true },
                                        { name: 'em', attributes: true },
                                        { name: 'blockquote', attributes: true },
                                        { name: 'a', attributes: ['href', 'target', 'rel'] },
                                        { name: 'img', attributes: ['src', 'alt', 'width', 'height'] },
                                        { name: 'iframe', attributes: ['src', 'width', 'height', 'allowfullscreen'] },
                                    ],
                                    disallow: [
                                        { name: 'div' },
                                        { name: 'section' },
                                        { name: 'aside' },
                                        { name: 'article' },
                                        { name: 'header' },
                                        { name: 'footer' },
                                    ]
                                },
                            }}
                            data={content || ''}
                            onChange={(event, editor) => setContent(editor.getData())}
                        />
                    )}
                </div>

                <div className="col-md-4">
                    <h5 className="fw-bold mb-3">
                        Thông Tin <span className="text-primary">Bài Viết</span>
                    </h5>

                    <div className="mb-3">
                        <label className="form-label">Tiêu Đề Bài Viết</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Tiêu đề bài viết"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Vùng Miền</label>
                        <RegionSelect value={regionId} onChange={(e) => setRegionId(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Chọn Ảnh</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={handleImageUpload}
                            ref={imageInputRef}
                            required
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddTag(e);
                            }}
                        />
                    </div>

                    <div className="d-flex gap-3 mt-4">
                        <button type="button" className="btn btn-outline-secondary flex-fill" onClick={handleSaveDraft}>
                            Lưu Bản Nháp
                        </button>
                        <button type="submit" className="btn btn-danger flex-fill">
                            Đăng Bài Viết
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddPostUser;
