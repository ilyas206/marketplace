import { useState, useEffect, useRef } from 'react';
import { useThread, useSendMessage } from '../../hooks/useMessages';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCheck, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ChatThread({ otherUserId, orderId }) {
  const { data: messages, isLoading } = useThread(otherUserId, orderId);
  const sendMessage = useSendMessage(otherUserId, orderId);
  const [body, setBody] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!body.trim()) return;

    sendMessage.mutate(
      { receiver_id: otherUserId, order_id: orderId, body },
      { onSuccess: () => setBody('') }
    );
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <img
        src="/thread_bg.png"
        alt="Threads background"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="relative flex-1 space-y-1 overflow-y-auto p-3">
        {
            isLoading && <div className="space-y-2 p-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        }


        {messages?.data.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                msg.is_mine
                  ? 'bg-action text-white'
                  : 'bg-lighter text-darker'
              }`}
            >
              <p className=''>{msg.body}</p>
              <div className='mt-1 text-xs flex items-center gap-1 justify-end'>
                <p className={msg.is_mine ? 'text-white/70' : 'text-darker/70'}>
                    {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    })}
                </p>
                {
                    msg.is_mine && <CheckCheck size={17} className={msg.read_at ? 'text-success' : 'text-lighter'} />
                }
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="relative flex items-center gap-1 border-t border-slate-200/70 bg-white/75 p-3 backdrop-blur-sm">
        <Input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          placeholder="Type a message..."
          className="text-darker p-3"
        />
        <Button type="submit" className="p-4 bg-action hover:bg-darker" disabled={sendMessage.isPending || !body.trim()}>
          <Send />
        </Button>
      </form>

      {sendMessage.isError && (
        <p className="px-3 pb-2 text-sm text-destructive">
          {sendMessage.error.response?.data?.message ??
            Object.values(sendMessage.error.response?.data?.errors ?? {})[0]?.[0] ??
            'Message not sent.'}
        </p>
      )}
    </div>
  );
}