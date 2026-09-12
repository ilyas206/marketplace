import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dot } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-slate-100 text-slate-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderHistory() {
  const { data, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-4 text-center mt-7">
        <img src="no_orders.jpg" alt="No orders so far" className='w-80 h-70 rounded-lg' />
        <h3 className="text-2xl font-bold text-action">You haven't placed any orders yet.</h3>
        <Link to="/">
          <Button className="bg-action hover:bg-darker mt-3">Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-xl font-bold text-action">My Orders</h1>

      <div className="space-y-3">
        {data.data.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:shadow-sm"
          >
            <div>
              <p className="font-medium text-slate-900">Order #{order.id}</p>
              <p className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                {new Date(order.created_at).toLocaleDateString()} <Dot size={20}/> {order.items.length} item(s)
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-darker">{order.total_amount} MAD</p>
              <Badge className={STATUS_COLORS[order.status]}>{order.status}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}