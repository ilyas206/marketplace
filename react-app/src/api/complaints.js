import api from './axios';

export const fileComplaint = async (payload) => {
  const { data } = await api.post('/complaints', payload);
  return data;
};

export const getMyComplaints = async () => {
  const { data } = await api.get('/complaints');
  return data;
};