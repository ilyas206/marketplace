import api from './axios';

export const checkout = async (payload) => {
  const { data } = await api.post('/checkout', payload);
  return data; // { message, order }
};

export const getOrders = async (params) => {
  const { data } = await api.get('/orders', { params });
  return data;
};

export const getOrder = async (orderId) => {
  const { data } = await api.get(`/orders/${orderId}`);
  return data;
};

export const cancelOrderItem = async (itemId) => {
  const { data } = await api.patch(`/order-items/${itemId}/cancel`);
  return data;
};