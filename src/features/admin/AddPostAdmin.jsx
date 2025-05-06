import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import RegionSelect from '../../components/ui/RegionSelect';

const AddPostAdmin = () => {
  const [title, setTitle] = useState('');
  const [regionId, setRegionId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [content, setContent] = useState('');

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('regionId', regionId);
    formData.append('imageFile', imageFile);
    formData.append('content', content);
    formData.append('author', localStorage.getItem('username'));

    try {
      await axios.post('/api/post/upload', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Admin đã đăng bài thành công!');
    } catch (error) {
      console.error(error);
      alert('Lỗi khi đăng bài (Admin)');
    }
  };

  // 👇 Custom CKEditor upload adapter
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
                Authorization: `Bearer ${localStorage.getItem('admin_token')}`
              }
            });

            return { default: response.data.url };
          } catch (error) {
            console.error('Upload error:', error);
            throw error;
          }
        }
      };
    };
  }

  return (
    <div className="container mt-4">
      <h3>Đăng bài viết (Admin)</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Vùng miền</label>
          <RegionSelect value={regionId} onChange={(e) => setRegionId(e.target.value)} />
        </div>

        <div className="mb-3">
          <label>Ảnh đại diện</label>
          <input type="file" className="form-control" onChange={handleImageUpload} required />
        </div>

        <div className="mb-3">
          <label>Nội dung</label>
          <CKEditor
            editor={ClassicEditor}
            config={{ extraPlugins: [CustomUploadAdapterPlugin] }}
            data={content}
            onChange={(event, editor) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
        </div>

        <button className="btn btn-success">Đăng bài (Admin)</button>
      </form>
    </div>
  );
};

export default AddPostAdmin;
