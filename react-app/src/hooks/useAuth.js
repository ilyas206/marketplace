import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import * as authApi from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const location = useLocation();
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

      // If the user was redirected here from a specific page (e.g. checkout), go back there
      const redirectTo = location.state?.from;
      if (redirectTo) {
        navigate(redirectTo);
        return;
      }

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
  const setItemsCount = useCartStore((s) => s.setItemsCount);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Clear regardless of API success/failure — token might already be invalid
      logoutStore();
      setItemsCount(0);
      queryClient.clear();
      navigate('/login');
    },
  });
};