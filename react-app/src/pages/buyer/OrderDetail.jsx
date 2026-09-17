import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrders';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dot, MessagesSquare } from 'lucide-react';

const STATUS_LABELS = {
  pending: { label: 'Pending confirmation', color: 'bg-slate-100 text-slate-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  shipped: { label: 'Shipped', color: 'bg-amber-100 text-amber-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {location.state?.justPlaced && (
        <div className="mb-6 rounded-lg bg-success/10 p-4 text-success font-semibold">
          Order placed successfully. You'll be notified as it progresses.
        </div>
      )}

      <div className="mb-6 flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-semibold text-darker">Order #{order.id}</h1>
          <p className="text-sm text-slate-500">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 p-4 space-y-2">
        <p className="text-sm text-slate-500">Delivering to</p>
        <p className="text-darker">{order.shipping_address}</p>
        <p className="text-sm text-darker">{order.phone}</p>
      </div>

      <Separator className="my-6 bg-borders" />

      <h2 className="mb-3 text-sm font-medium text-slate-500">Items</h2>
      <div className="space-y-3">
        {order.items.map((item) => {
          const status = STATUS_LABELS[item.item_status] ?? STATUS_LABELS.pending;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
            >
              <div>
                <Link
                  to={`/products/${item.product.slug}`}
                  className="font-medium text-slate-900 hover:underline"
                >
                  {item.product.title}
                </Link>
                <p className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                  Qty <span className='font-semibold'>{item.quantity}</span> <Dot size={20}/> <span className='font-semibold'>{item.unit_price}</span> MAD each <Dot size={20}/> Sold by <span className='font-semibold'>{item.seller.name}</span>
                </p>
                <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                    onClick={() => navigate(`/messages/${item.seller.id}?order=${order.id}`)}
                  >
                    Message Seller <MessagesSquare />
                  </Button>
              </div>
              <Badge className={status.color}>{status.label}</Badge>
            </div>
          );
        })}
      </div>

      <Separator className="my-6 bg-borders" />

      <div className="flex justify-between text-lg font-bold text-darker">
        <span>Total</span>
        <span>{order.total_amount} MAD</span>
      </div>
    </div>
  );
}