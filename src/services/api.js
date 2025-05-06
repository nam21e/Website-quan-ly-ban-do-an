import axios from 'axios';

const API_URL = 'http://localhost:5094/api'; // đổi lại nếu bạn dùng cổng khác

export const getFoods = async () => {
  const response = await axios.get(`${API_URL}/foods`);
  return response.data;
};