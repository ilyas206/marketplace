import api from './axios';

export const getCart = async () => {
  const { data } = await api.get('/cart');
  return data.data ?? data;
};

export const addToCart = async ({ product_id, quantity }) => {
  const { data } = await api.post('/cart/items', { product_id, quantity });
  return data.data ?? data;
};

export const updateCartItem = async ({ itemId, quantity }) => {
  const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
  return data.data ?? data;
};

export const removeCartItem = async (itemId) => {
  const { data } = await api.delete(`/cart/items/${itemId}`);
  return data.data ?? data;
};