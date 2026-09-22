import { Link } from 'react-router-dom';
import { useMyComplaints } from '../../hooks/useComplaints';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FaceNeutral } from 'lucide-react';

const STATUS_COLORS = {
  open: 'bg-red-100 text-red-700 w-full',
  in_progress: 'bg-amber-100 text-amber-700 w-full',
  resolved: 'bg-green-100 text-green-700 w-full',
};

export default function MyComplaints() {
  const { data, isLoading } = useMyComplaints();

  if (isLoading) return <div className="mx-auto max-w-2xl px-6 py-8 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;

  if (!data || data.data.length === 0) {
    return <img src="/no_own_complaints.png" alt="No own complaints." className='mx-auto md:w-3/5 max-h-95 mt-6' />
  }

  console.log(data.data)

  return (
    <div className="mx-auto md:px-6 py-2">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-action">My Complaints</h1>
        <Link to="/buyer/file-complaint"><Button size="sm" className="bg-action hover:bg-darker">+ New Complaint</Button></Link>
      </div>
      <div className="space-y-3">
        {data.data.map((c) => (
          <div key={c.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex flex-col gap-3 md:flex-row items-center justify-between">
              <div className='space-y-3 md:max-w-2/3'>
                <p className="font-semibold text-slate-900">{c.subject}</p>
                <div className='flex items-center justify-center gap-1'>
                  {
                    c.seller && <Badge className="bg-action/80"><FaceNeutral /> Seller : {c.seller.name}</Badge>
                  }
                  {
                    c.order && <><Badge>Order #{c.order.id}</Badge></>
                  }
                </div>

                <p className="text-sm font-semibold text-slate-700">{c.description}</p>
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