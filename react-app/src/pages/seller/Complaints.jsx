import { useSellerComplaints } from '../../hooks/useSellerComplaints';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_COLORS = {
  open: 'bg-red-100 text-red-700 w-full',
  in_progress: 'bg-amber-100 text-amber-700 w-full',
  resolved: 'bg-green-100 text-green-700 w-full',
};

export default function SellerComplaints() {
  const { data, isLoading } = useSellerComplaints();

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;

  if (!data || data.data.length === 0) {
    return <img src="/no_against_complaints.png" alt="No complaints filed against you." className='mx-auto md:w-3/5 max-h-95 mt-6' />
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-action">Complaints</h1>
      <div className="space-y-3">
        {data.data.map((c) => (
          <div key={c.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex flex-col gap-4 md:flex-row items-center justify-between">
              <div className='space-y-2'>
                <p className="font-medium text-slate-900">{c.subject}</p>
                <p className="text-sm text-slate-500">
                  Filed by {c.buyer.name} {c.order && `· Order #${c.order.id}`}
                </p>
                <p className="mt-2 text-sm text-slate-700">{c.description}</p>
              </div>
              <div className='flex flex-col gap-1 md:max-w-1/3'>
                <Badge className={STATUS_COLORS[c.status]}>{c.status.replace('_', ' ')}</Badge>
                {c.admin_response && (
                  <p className={`text-xs rounded p-2 ${c.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    <span className='font-medium'>Admin response:</span> {c.admin_response}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}