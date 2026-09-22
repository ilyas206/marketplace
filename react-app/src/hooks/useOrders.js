import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkout, getOrders, getOrder, cancelOrderItem } from '../api/orders';
import { useCartStore } from '../store/cartStore';

export const useCheckout = () => {
  const queryClient = useQueryClient();
  const setItemsCount = useCartStore((s) => s.setItemsCount);

  return useMutation({
    mutationFn: checkout,
    onSuccess: () => {
      // Cart is now empty server-side (Step 57 clears it inside the transaction) —
      // invalidate rather than manually zero it out, so the next cart read is authoritative
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      setItemsCount(0);
    },
  });
};

export const useOrders = (params) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
  });
};

export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });
};

export const useCancelOrderItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelOrderItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};