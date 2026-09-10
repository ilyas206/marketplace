import api from './axios';

export const toggleWishlist = async (product_id) => {
  const { data } = await api.post('/wishlist/toggle', { product_id });
  return data;
};