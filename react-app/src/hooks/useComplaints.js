import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as complaintsApi from '../api/complaints';

export const useMyComplaints = () => {
  return useQuery({ queryKey: ['my-complaints'], queryFn: complaintsApi.getMyComplaints });
};

export const useFileComplaint = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: complaintsApi.fileComplaint,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-complaints'] }),
  });
};