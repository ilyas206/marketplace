import { useQuery } from '@tanstack/react-query';
import * as sellerApi from '../api/seller';

export const useBestSelling = () => {
  return useQuery({
    queryKey: ['seller-stats', 'best-selling'],
    queryFn: sellerApi.getBestSelling,
  });
};

export const useTopCategories = () => {
  return useQuery({
    queryKey: ['seller-stats', 'top-categories'],
    queryFn: sellerApi.getTopCategories,
  });
};

export const useIncome = (period) => {
  return useQuery({
    queryKey: ['seller-stats', 'income', period],
    queryFn: () => sellerApi.getIncome(period),
  });
};