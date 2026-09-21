import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishlist, toggleWishlist } from '../api/wishlist';

export const useWishlist = () => {
  return useQuery({ queryKey: ['wishlist'], queryFn: getWishlist });
};

export const useToggleWishlist = (productSlug) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleWishlist,
    onSuccess: () => {
      // Refetch the product detail so is_wishlisted reflects the new state
      queryClient.invalidateQueries({ queryKey: ['product', productSlug] });
    },
  });
};