import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminApi from '../api/admin';

// Seller requests
export const useSellerRequests = (params) =>
  useQuery({ queryKey: ['admin-seller-requests', params], queryFn: () => adminApi.getSellerRequests(params) });

export const useSellerRequest = (id) =>
  useQuery({ queryKey: ['admin-seller-request', id], queryFn: () => adminApi.getSellerRequest(id), enabled: !!id });

export const useApproveSellerRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.approveSellerRequest,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-seller-requests'] }),
  });
};

export const useRejectSellerRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.rejectSellerRequest,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-seller-requests'] }),
  });
};

// Categories
export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
};

// Products
export const useAdminProducts = (params) =>
  useQuery({ queryKey: ['admin-products', params], queryFn: () => adminApi.getAdminProducts(params) });

export const useUpdateProductStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.updateProductStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  });
};

// Users
export const useUsers = (params) =>
  useQuery({ queryKey: ['admin-users', params], queryFn: () => adminApi.getUsers(params) });

export const useToggleUserSuspension = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.toggleUserSuspension,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

// Complaints
export const useAdminComplaints = (params) =>
  useQuery({ queryKey: ['admin-complaints', params], queryFn: () => adminApi.getAdminComplaints(params) });

export const useResolveComplaint = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.resolveComplaint,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-complaints'] }),
  });
};