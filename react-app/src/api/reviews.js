import api from './axios';

export const getProductReviews = async (slug) => {
  const { data } = await api.get(`/products/${slug}/reviews`);
  return data;
};

export const getMyReviews = async () => {
  const { data } = await api.get('/reviews/mine');
  return data;
};

export const submitReview = async (payload) => {
  const { data } = await api.post('/reviews', payload);
  return data;
};

export const deleteReview = async (reviewId) => {
  const { data } = await api.delete(`/reviews/${reviewId}`);
  return data;
};