import api from './axios';

export const getProducts = async (params) => {
  const { data } = await api.get('/products', { params });
  return data;
};

export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data.data; // Laravel resource wraps single items in { data: {...} }
};

export const getRelatedProducts = async (slug) => {
  const { data } = await api.get(`/products/${slug}/related`);
  return data.data;
};

export const getSellerProducts = async (sellerId, page = 1) => {
  const { data } = await api.get(`/sellers/${sellerId}/products`, { params: { page } });
  return data;
};