import { useState } from 'react';
import { useSellerRequests, useSellerRequest, useApproveSellerRequest, useRejectSellerRequest } from '../../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dot, FileText, ThumbsDown, ThumbsUp } from 'lucide-react';

export default function SellerRequests() {
  const { data, isLoading } = useSellerRequests();
  const [viewingId, setViewingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState('');

  const { data: detail } = useSellerRequest(viewingId);
  const approve = useApproveSellerRequest();
  const reject = useRejectSellerRequest();

  const handleApprove = (id) => {
    approve.mutate(id, {
      onSuccess: (response) => toast.success(response.message, {
        style: {
          background: 'var(--success)',
          color: 'var(--background)',
          border: 'transparent'
        },
      })
    });
  };

  const handleReject = () => {
    reject.mutate({ id: rejectingId, reason }, {
      onSuccess: (response) => {
        setRejectingId(null);
        setReason('');
        toast.warning(response.message, {
          style: {
            background: 'var(--destructive)',
            color: 'var(--background)',
            border: 'transparent'
          },
        })
      },
    });
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-action">Seller Applications</h1>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      )}

      {data && data.data.length === 0 && (
        <img src="/no_pending_apps.png" alt="No pending applications." className='mx-auto w-3/5 max-h-95 mt-6' />
      )}

      <div className="space-y-3">
        {data?.data.map((app) => (
          <div key={app.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start">
                <p className="font-semibold text-slate-900 mb-1">{app.business_name}</p>
                <p className="flex items-center font-semibold text-sm text-slate-500">{app.user.name} <Dot/> {app.user.email}</p>
                <p className="mt-1 text-sm font-light text-start text-slate-600">{app.description}</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" onClick={() => setViewingId(app.id)} className="text-action bg-action/20 hover:bg-action/30">
                  View <FileText />
                </Button>
                <Button size="sm" onClick={() => handleApprove(app.id)} disabled={approve.isPending} className=" text-success bg-success/20 hover:bg-success/30">
                  Approve <ThumbsUp />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setRejectingId(app.id)}>
                  Reject <ThumbsDown />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View document dialog */}
      <Dialog open={!!viewingId} onOpenChange={(open) => !open && setViewingId(null)}>
        <DialogContent className="text-center">
          <DialogHeader><DialogTitle className="font-semibold">{detail?.business_name}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-2 text-sm">
              <p className='font-medium'><span className="text-slate-500">Applicant :</span> {detail.user.name}</p>
              <p className='text-slate-600 font-light'>{detail.user.email}</p>
              <p className='font-medium'><span className="text-slate-500">Description :</span> {detail.description}</p>
              <p className='font-medium'><span className="text-slate-500">Submitted :</span> {new Date(detail.submitted_at).toLocaleString()}</p>
              <a
                href={detail.document_url}
                target="_blank"
                rel="noreferrer"
                className="inline-block font-semibold text-xs text-action bg-action/20 hover:bg-action/30 p-2 rounded-sm mt-4"
              >
                View submitted document
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject reason dialog */}
      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject application</DialogTitle></DialogHeader>
          <Textarea
            placeholder="Reason for rejection (shown to the applicant)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleReject}
            disabled={reject.isPending || !reason.trim()}
          >
            Confirm Rejection
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}