import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as messagesApi from '../api/messages';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: messagesApi.getConversations,
    refetchInterval: 15000, // light polling — no websockets set up, this keeps unread counts reasonably fresh
  });
};

export const useThread = (userId, orderId) => {
  return useQuery({
    queryKey: ['thread', userId, orderId],
    queryFn: () => messagesApi.getThread(userId, orderId),
    enabled: !!userId,
    refetchInterval: 5000, // faster polling while a thread is actively open
  });
};

export const useSendMessage = (userId, orderId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', userId, orderId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};