import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerOrderItems, useUpdateOrderItemStatus } from '../../hooks/useSellerOrders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dot, MessagesSquare } from "lucide-react";

const STATUS_LABELS = {
  pending: { label: 'Pending', color: 'bg-slate-100 text-slate-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  shipped: { label: 'Shipped', color: 'bg-amber-100 text-amber-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

// Mirrors the backend's $allowedTransitions exactly (Step 59) — kept in sync deliberately,
// since diverging here would let the UI show actions the API will reject
const NEXT_ACTIONS = {
  pending: [
    { status: 'confirmed', label: 'Confirm order', variant: 'default' },
    { status: 'cancelled', label: 'Cancel order', variant: 'destructive' },
  ],
  confirmed: [
    { status: 'shipped', label: 'Mark as shipped', variant: 'default' },
    { status: 'cancelled', label: 'Cancel order', variant: 'destructive' },
  ],
  shipped: [
    { status: 'delivered', label: 'Mark as delivered', variant: 'default' },
  ],
  delivered: [],
  cancelled: [],
};

export default function SellerOrderItems() {
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();
  const { data, isLoading } = useSellerOrderItems({ status: statusFilter || undefined });
  const updateStatus = useUpdateOrderItemStatus();

  const handleStatusChange = (itemId, status) => {
    updateStatus.mutate({ itemId, status });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-action">Incoming Orders</h1>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">All statuses</SelectItem>
            {Object.keys(STATUS_LABELS).map((s) => (
              <SelectItem key={s} value={s} className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">
                {STATUS_LABELS[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <img src="/no_matching_orders.png" alt="No orders match this filter" className='mx-auto w-3/5' />
      )}

      {data && data.data.length > 0 && (
        <div className="space-y-3">
          {data.data.map((item) => {
            const status = STATUS_LABELS[item.item_status];
            const actions = NEXT_ACTIONS[item.item_status] ?? [];

            return (
              <div
                key={item.id}
                className="rounded-lg border border-borders p-4"
              >
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-darker">{item.product.title}</p>
                    <p className="flex items-center gap-1 justify-center text-sm text-slate-500 mt-2">
                      Qty <span className="font-semibold">{item.quantity}</span> <Dot/> Order <span className="font-semibold">#{item.order.id}</span> <Dot/> {' '}
                      <span className="font-semibold">{new Date(item.order.created_at).toLocaleDateString()}</span>
                    </p>
                    <p className="flex items-center gap-1 justify-center mt-1 text-sm text-slate-500">
                      Deliver to : <span className="font-semibold">{item.order.shipping_address}</span> <Dot/> <span className="font-semibold">{item.order.phone}</span>
                    </p>

                    <div className="mt-5 flex justify-center gap-6">
                      {actions.length > 0 && (
                        <div className='flex gap-1'>
                          {actions.map((action) => (
                            <Button
                                key={action.status}
                                size="sm"
                                variant={action.variant}
                                disabled={updateStatus.isPending}
                                onClick={() => handleStatusChange(item.id, action.status)}
                            >
                                {action.label}
                            </Button>
                            ))}
                        </div>
                      )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/messages/${item.order.buyer_id}?order=${item.order.id}`)}
                        >
                          Message Buyer <MessagesSquare />
                        </Button>
                    </div>

                    {updateStatus.isError &&
                        updateStatus.variables?.itemId === item.id && (
                            <p className="mt-3 text-sm text-destructive font-semibold">
                            {updateStatus.error.response?.data?.message ?? 'Update failed.'}
                            </p>
                        )}
                  </div>
                  <Badge className={status.color}>{status.label}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}