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
  const guestId = localStorage.getItem('guest_cart_id');

  if (!guestId) return;

  await api.post('/cart/merge', null, {
    headers: { 'X-Guest-Cart-Id': guestId },
  });
};