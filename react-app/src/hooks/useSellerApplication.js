import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as sellerAppApi from '../api/sellerApplication';

export const useApplicationStatus = () => {
  return useQuery({
    queryKey: ['seller-application-status'],
    queryFn: sellerAppApi.getApplicationStatus,
  });
};

export const useApplyAsSeller = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sellerAppApi.applyAsSeller,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['seller-application-status'] }),
  });
};