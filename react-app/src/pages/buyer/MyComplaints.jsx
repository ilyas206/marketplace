import { useMyComplaints } from '../../hooks/useComplaints';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_COLORS = {
  open: 'bg-red-100 text-red-700 w-full',
  in_progress: 'bg-amber-100 text-amber-700 w-full',
  resolved: 'bg-green-100 text-green-700 w-full',
};

export default function MyComplaints() {
  const { data, isLoading } = useMyComplaints();

  if (isLoading) return <div className="mx-auto max-w-2xl px-6 py-8 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;

  if (!data || data.data.length === 0) {
    return <img src="/no_own_complaints.png" alt="No own complaints." className='mx-auto w-3/5 max-h-95 mt-6' />
  }

  return (
    <div className="mx-auto px-6 py-2">
      <h1 className="mb-6 text-xl font-semibold text-action">My Complaints</h1>
      <div className="space-y-3">
        {data.data.map((c) => (
          <div key={c.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className='flex flex-col items-start'>
                <p className="font-medium text-slate-900">{c.subject}</p>
                <p className="mt-1 text-sm font-light text-slate-600 text-start">{c.description}</p>
              </div>
              <div className='flex flex-col gap-1 max-w-1/3'>
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