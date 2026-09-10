import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../api/cart';
import { useCartStore } from '../store/cartStore';
import { useEffect } from 'react';

export const useCart = () => {
  const setItemsCount = useCartStore((s) => s.setItemsCount);

  const query = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  useEffect(() => {
    if (query.data) {
      setItemsCount(query.data.items_count);
    }
  }, [query.data, setItemsCount]);

  return query;
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const setItemsCount = useCartStore((s) => s.setItemsCount);

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data); // update cache directly, no refetch needed
      setItemsCount(data.items_count);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const setItemsCount = useCartStore((s) => s.setItemsCount);

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
      setItemsCount(data.items_count);
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const setItemsCount = useCartStore((s) => s.setItemsCount);

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
      setItemsCount(data.items_count);
    },
  });
};