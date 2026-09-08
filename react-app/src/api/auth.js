import api from './axios';

export const login = async (credentials) => {
  const { data } = await api.post('/login', credentials);
  return data; // { user, token }
};

export const register = async (payload) => {
  const { data } = await api.post('/register', payload);
  return data; // { user, token }
};

export const logout = async () => {
  await api.post('/logout');
};

export const mergeGuestCart = async () => {
  await api.post('/cart/merge');
};