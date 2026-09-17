import api from './axios';

export const getConversations = async () => {
  const { data } = await api.get('/messages/conversations');
  return data;
};

export const getThread = async (userId, orderId) => {
  const { data } = await api.get(`/messages/thread/${userId}`, {
    params: orderId ? { order_id: orderId } : {},
  });
  return data;
};

export const sendMessage = async (payload) => {
  const { data } = await api.post('/messages', payload);
  return data;
};