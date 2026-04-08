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
                const postRes = await axios.get(`http://localhost:5094/api/Post/${id}`);
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
                console.error("Lỗi load:", err);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('regionId', regionId);

        if (imageFile) {
            formData.append('imageFile', imageFile);
        }

        tags.forEach(tag => formData.append('tags', tag));

        try {
            await axios.put(`http://localhost:5094/api/Post/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('✅ Cập nhật thành công!');
            navigate('/admin/posts');
        } catch (err) {
            console.error(err);
            alert('❌ Lỗi cập nhật!');
        }
    };

    return (
        <div className="container-fluid">
            <h3 className="mb-4 fw-bold">📝 Sửa Bài Viết</h3>

            <form onSubmit={handleSubmit} className="row">
                <div className="col-md-8">
                    <input
                        className="form-control mb-3"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {editorReady && (
                        <CKEditor
                            editor={ClassicEditor}
                            data={content}
                            onChange={(e, editor) => setContent(editor.getData())}
                        />
                    )}
                </div>

                <div className="col-md-4">
                    <select
                        className="form-select mb-3"
                        value={regionId}
                        onChange={(e) => setRegionId(e.target.value)}
                    >
                        <option value="">-- Chọn vùng --</option>
                        {regions.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>

                    <input
                        type="file"
                        className="form-control mb-3"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />

                    <input
                        className="form-control mb-3"
                        placeholder="Nhập tag rồi Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (tagInput.trim()) {
                                    setTags([...tags, tagInput]);
                                    setTagInput('');
                                }
                            }
                        }}
                    />

                    <button className="btn btn-primary w-100">
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;