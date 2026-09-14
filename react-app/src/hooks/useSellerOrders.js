import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as sellerApi from '../api/seller';

export const useSellerOrderItems = (params) => {
  return useQuery({
    queryKey: ['seller-order-items', params],
    queryFn: () => sellerApi.getSellerOrderItems(params),
  });
};

export const useUpdateOrderItemStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sellerApi.updateOrderItemStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-order-items'] });
    },
  });
};