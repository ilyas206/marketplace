import api from './axios';

export const applyAsSeller = async (formData) => {
  const { data } = await api.post('/seller/apply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getApplicationStatus = async () => {
  const { data } = await api.get('/seller/application-status');
  return data;
};