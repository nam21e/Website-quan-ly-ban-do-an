import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000';

const AddRegion = () => {
  const [name, setName] = useState('');
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRegions = async () => {
    try {
      const res = await axios.get(`${API}/regions`);
      setRegions(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Lỗi tải vùng miền:', error);
      setRegions([]);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Vui lòng nhập tên vùng miền');
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API}/regions`,
        { name: name.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
          },
        }
      );

      alert('Thêm vùng miền thành công!');
      setName('');
      fetchRegions();
    } catch (error) {
      console.error('Lỗi thêm vùng miền:', error);
      alert('Không thể thêm vùng miền!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Bạn có chắc muốn xóa vùng miền này?');
    if (!ok) return;

    try {
      await axios.delete(`${API}/regions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}`,
        },
      });

      alert('Xóa vùng miền thành công!');
      fetchRegions();
    } catch (error) {
      console.error('Lỗi xóa vùng miền:', error);
      alert('Không thể xóa vùng miền!');
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="fw-bold mb-4">Thêm Vùng Miền</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Tên vùng miền</label>
          <input
            type="text"
            className="form-control"
            placeholder="Miền Bắc / Trung / Nam..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Đang thêm...' : 'Thêm'}
        </button>
      </form>

      <hr />

      <h3 className="fw-bold mb-3">Danh sách vùng miền</h3>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: '80px' }}>#</th>
              <th>Tên vùng miền</th>
              <th style={{ width: '160px' }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {regions.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">
                  Chưa có vùng miền nào
                </td>
              </tr>
            ) : (
              regions.map((region, index) => (
                <tr key={region.id}>
                  <td>{index + 1}</td>
                  <td>{region.name || region.region_name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(region.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddRegion;