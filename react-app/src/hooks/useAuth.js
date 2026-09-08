import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      setAuth(data.user, data.token);

      // Merge guest cart into user cart now that we have a token (Step 63 endpoint)
      try {
        await authApi.mergeGuestCart();
        localStorage.removeItem('guest_cart_id');
      } catch {
        // Non-fatal — merge failing shouldn't block login
      }

      queryClient.invalidateQueries({ queryKey: ['cart'] });

      // Redirect based on role
      const roleNames = data.user.roles?.map((r) => r.name) ?? [];
      if (roleNames.includes('admin')) navigate('/admin/dashboard');
      else if (roleNames.includes('seller')) navigate('/seller/dashboard');
      else navigate('/');
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate('/'); // new users are always 'buyer' role — Step 41
    },
  });
};

export const useLogout = () => {
  const logoutStore = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Clear regardless of API success/failure — token might already be invalid
      logoutStore();
      queryClient.clear();
      navigate('/login');
    },
  });
};