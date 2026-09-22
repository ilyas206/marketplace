import { useState } from 'react';
import { useAdminComplaints, useResolveComplaint } from '../../hooks/useAdmin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dot, FaceAngry, FaceNeutral } from 'lucide-react';
import { toast } from "sonner";

const STATUS_COLORS = {
  open: 'bg-red-100 text-red-700 w-full',
  in_progress: 'bg-amber-100 text-amber-700 w-full',
  resolved: 'bg-green-100 text-green-700 w-full',
};

export default function AdminComplaints() {
  const { data, isLoading } = useAdminComplaints();
  const resolve = useResolveComplaint();

  const [resolvingId, setResolvingId] = useState(null);
  const [response, setResponse] = useState('');

  const handleResolve = (status) => {
    resolve.mutate(
      { id: resolvingId, status, admin_response: response },
      { onSuccess: (response) => { setResolvingId(null); setResponse(''); toast.success(response.message , {
        style: {
          background: 'var(--success)',
          color: 'var(--background)',
          border: 'transparent'
        },
      }) 
    } }
    );
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-action">Complaints</h1>

      {isLoading && (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      )}

      {data && data.data.length === 0 && (
        <img src="/no_complaints.png" alt="No complaints filed." className='mx-auto md:w-3/5 max-h-95 mt-8' />
      )}

      <div className="space-y-3">
        {data?.data.map((c) => (
          <div key={c.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex flex-col gap-4 md:flex-row items-center justify-between">
              <div className='space-y-3 max-w-2/3'>
                <p className="font-semibold text-slate-900">{c.subject}</p>
                <div className='flex flex-col gap-2 md:flex-row items-center justify-center'>
                  <Badge className="bg-destructive/80"><FaceAngry /> Buyer : {c.buyer.name}</Badge>
                  {
                    c.seller && <><Badge className="bg-action/80"><FaceNeutral /> Seller : {c.seller.name}</Badge></>
                  }
                  {
                    c.order && <><Badge>Order #{c.order.id}</Badge></>
                  }
                </div>

                <p className="text-sm font-semibold text-slate-700">{c.description}</p>
                {c.status !== 'resolved' && (
                  <Button size="sm" className="bg-success/20 text-success hover:bg-success/40" onClick={() => setResolvingId(c.id)}>
                    Respond
                  </Button>
                )}
              </div>
              <div className='flex flex-col gap-1 md:max-w-1/3'>
                <Badge className={STATUS_COLORS[c.status]}>{c.status.replace('_', ' ')}</Badge>
                {c.admin_response && (
                  <p className={`text-xs rounded p-2 ${c.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    <span className='font-medium'>Your response:</span> {c.admin_response}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!resolvingId} onOpenChange={(open) => !open && (setResolvingId(null), setResponse(''))}>
        <DialogContent>
          <DialogHeader><DialogTitle>Respond to complaint</DialogTitle></DialogHeader>
          <Textarea
            placeholder="Your response..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 text-amber-700 border-amber-700 hover:bg-amber-700 hover:text-white"
              disabled={!response.trim() || resolve.isPending}
              onClick={() => handleResolve('in_progress')}
            >
              Mark In Progress
            </Button>
            <Button
              className="flex-1 bg-success/90 hover:bg-success"
              disabled={!response.trim() || resolve.isPending}
              onClick={() => handleResolve('resolved')}
            >
              Mark Resolved
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}