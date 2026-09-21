import api from './axios';

// Seller requests
export const getSellerRequests = async (params) => {
  const { data } = await api.get('/admin/seller-requests', { params });
  return data;
};
export const getSellerRequest = async (id) => {
  const { data } = await api.get(`/admin/seller-requests/${id}`);
  return data;
};
export const approveSellerRequest = async (id) => {
  const { data } = await api.post(`/admin/seller-requests/${id}/approve`);
  return data;
};
export const rejectSellerRequest = async ({ id, reason }) => {
  const { data } = await api.post(`/admin/seller-requests/${id}/reject`, { reason });
  return data;
};

// Categories
export const createCategory = async (payload) => {
  const { data } = await api.post('/admin/categories', payload);
  return data;
};
export const updateCategory = async ({ id, payload }) => {
  const { data } = await api.put(`/admin/categories/${id}`, payload);
  return data;
};
export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/admin/categories/${id}`);
  return data;
};

// Products
export const getAdminProducts = async (params) => {
  const { data } = await api.get('/admin/products', { params });
  return data;
};
export const updateProductStatus = async ({ id, status }) => {
  const { data } = await api.patch(`/admin/products/${id}/status`, { status });
  return data;
};

// Users
export const getUsers = async (params) => {
  const { data } = await api.get('/admin/users', { params });
  return data;
};
export const toggleUserSuspension = async (id) => {
  const { data } = await api.patch(`/admin/users/${id}/toggle-suspension`);
  return data;
};

// Complaints
export const getAdminComplaints = async (params) => {
  const { data } = await api.get('/admin/complaints', { params });
  return data;
};
export const resolveComplaint = async ({ id, status, admin_response }) => {
  const { data } = await api.patch(`/admin/complaints/${id}/resolve`, { status, admin_response });
  return data;
};