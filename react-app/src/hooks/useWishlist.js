import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleWishlist } from '../api/wishlist';

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