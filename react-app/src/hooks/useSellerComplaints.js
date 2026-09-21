import { useQuery } from '@tanstack/react-query';
import * as sellerApi from '../api/seller';

export const useSellerComplaints = () => {
  return useQuery({ queryKey: ['seller-complaints'], queryFn: sellerApi.getSellerComplaints });
};