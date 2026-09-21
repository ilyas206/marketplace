import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as reviewsApi from '../api/reviews';

export const useProductReviews = (slug) => {
  return useQuery({
    queryKey: ['product-reviews', slug],
    queryFn: () => reviewsApi.getProductReviews(slug),
    enabled: !!slug,
  });
};

export const useMyReviews = () => {
  return useQuery({ queryKey: ['my-reviews'], queryFn: reviewsApi.getMyReviews });
};

export const useSubmitReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reviewsApi.submitReview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-reviews'] });
      qc.invalidateQueries({ queryKey: ['product'] }); // refresh average_rating on product page
    },
  });
};

export const useDeleteReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reviewsApi.deleteReview,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-reviews'] }),
  });
};