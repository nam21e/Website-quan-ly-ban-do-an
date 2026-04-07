import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RegionSelect = ({ value, onChange }) => {
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5094/api/Region')
      .then(res => setRegions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <select className="form-select" value={value} onChange={onChange}>
      <option value="">-- Chọn vùng miền --</option>
      {regions.map(region => (
        <option key={region.id} value={region.id}>{region.name}</option>
      ))}
    </select>
  );
};

export default RegionSelect;
