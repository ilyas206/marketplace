import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/users';

export const useUserProfile = (userId) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // profile info rarely changes mid-session
  });
};