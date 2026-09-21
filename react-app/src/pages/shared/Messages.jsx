import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useConversations } from '../../hooks/useMessages';
import { Skeleton } from '@/components/ui/skeleton';
import ChatThread from '../../components/shared/ChatThread';

export default function Messages() {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const { data: conversations, isLoading } = useConversations();
  const navigate = useNavigate();
  const orderId = searchParams.get('order') || undefined;

  return (
    <div className="flex h-[calc(100dvh-73px)] min-h-0 overflow-hidden">
      {/* Conversation list */}
      <aside className="w-72 shrink-0 overflow-y-auto border-r border-borders">
        <h1 className="border-b border-borders px-4 py-3 font-semibold text-action">
          Conversations
        </h1>

        {isLoading && (
          <div className="space-y-2 p-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        )}

        {conversations?.map((conv) => (
          <button
            key={conv.user.id}
            onClick={() => navigate(`/messages/${conv.user.id}`)}
            className={`flex w-full items-center justify-between border-b border-slate-100 cursor-pointer px-4 py-3 text-left ${
              userId === conv.user.id.toString() ? 'bg-lighter' : 'hover:bg-slate-200 transition duration-200'
            }`}
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">{conv.user.name}</p>
              <p className={`truncate text-sm text-slate-700 mt-1 ${conv.unread_count > 0 ? 'font-semibold' : 'font-normal'}`}>{conv.last_message}</p>
            </div>
            {conv.unread_count > 0 && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-action text-xs text-white">
                {conv.unread_count}
              </span>
            )}
          </button>
        ))}
      </aside>

      {/* Active thread */}
      <div className="min-w-0 min-h-0 flex-1 overflow-hidden">
        {userId ? (
          <ChatThread otherUserId={userId} orderId={orderId} />
        ) : (
          conversations && conversations.length === 0 ?
            <div className="flex h-full items-center justify-center">
                <img src="/no_conversations.png" alt="No conversations yet." className='max-h-95' />
            </div> : 
            <div className="flex h-full items-center justify-center">
                <img src="/select_conversation.png" alt="Select a conversation to start chatting." className='max-h-95' />
            </div>
        )}
      </div>
    </div>
  );
}