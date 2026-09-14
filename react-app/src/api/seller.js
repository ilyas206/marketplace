import api from './axios';

// Products
export const getSellerProducts = async (params) => {
  const { data } = await api.get('/seller/products', { params });
  return data;
};

export const createProduct = async (formData) => {
  const { data } = await api.post('/seller/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateProduct = async ({ productId, payload }) => {
  const { data } = await api.put(`/seller/products/${productId}`, payload);
  return data;
};

export const deleteProduct = async (productId) => {
  const { data } = await api.delete(`/seller/products/${productId}`);
  return data;
};

// Order items
export const getSellerOrderItems = async (params) => {
  const { data } = await api.get('/seller/order-items', { params });
  return data;
};

export const updateOrderItemStatus = async ({ itemId, status }) => {
  const { data } = await api.patch(`/seller/order-items/${itemId}/status`, { status });
  return data;
};

// Stats
export const getBestSelling = async () => {
  const { data } = await api.get('/seller/stats/best-selling');
  return data;
};

export const getTopCategories = async () => {
  const { data } = await api.get('/seller/stats/top-categories');
  return data;
};

export const getIncome = async (period) => {
  const { data } = await api.get('/seller/stats/income', { params: { period } });
  return data;
};

// Seller's own application status (reused from Step 94-ish pattern)
export const getSellerApplicationStatus = async () => {
  const { data } = await api.get('/seller/application-status');
  return data;
};