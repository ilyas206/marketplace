import api from './axios';

export const getUserProfile = async (userId) => {
  const { data } = await api.get(`/users/${userId}/profile`);
  return data;
};

export const getSupportContact = async () => {
  const { data } = await api.get('/seller/support-contact');
  return data;
};