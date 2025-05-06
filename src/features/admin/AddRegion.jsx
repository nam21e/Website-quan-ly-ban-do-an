import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddRegion = () => {
  const [name, setName] = useState('');
  const [regions, setRegions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách vùng miền
  const fetchRegions = async () => {
    try {
      const res = await axios.get('http://localhost:5094/api/Region');
      setRegions(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy vùng miền:', err);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5094/api/Region/${editingId}`, { id: editingId, name });
        alert('Cập nhật thành công!');
      } else {
        await axios.post('http://localhost:5094/api/Region', { name });
        alert('Thêm vùng miền thành công!');
      }
      setName('');
      setEditingId(null);
      fetchRegions();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleEdit = (region) => {
    setName(region.name);
    setEditingId(region.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xoá vùng miền này?')) {
      try {
        await axios.delete(`http://localhost:5094/api/Region/${id}`);
        fetchRegions();
      } catch (err) {
        console.error(err);
        alert('Không thể xoá vùng miền!');
      }
    }
  };

  return (
    <div>
      <h3>{editingId ? 'Cập nhật Vùng Miền' : 'Thêm Vùng Miền'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tên vùng miền</label>
          <input
            type="text"
            className="form-control"
            placeholder="Miền Bắc / Trung / Nam..."
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">
          {editingId ? 'Cập nhật' : 'Thêm'}
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary ms-2" onClick={() => {
            setEditingId(null);
            setName('');
          }}>
            Huỷ
          </button>
        )}
      </form>

      <hr />

      <h4 className="mt-4">Danh sách vùng miền</h4>
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Tên vùng miền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((region, index) => (
            <tr key={region.id}>
              <td>{index + 1}</td>
              <td>{region.name}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(region)}>
                  Sửa
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(region.id)}>
                  Xoá
                </button>
              </td>
            </tr>
          ))}
          {regions.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">Chưa có vùng miền nào</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddRegion;
