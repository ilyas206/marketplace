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