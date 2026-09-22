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
import { toast } from "sonner";

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
    { status: 'confirmed', label: 'Confirm order', className: 'text-action bg-action/20 hover:bg-action/30' },
    { status: 'cancelled', label: 'Cancel order', className: 'text-destructive bg-destructive/20 hover:bg-destructive/30' },
  ],
  confirmed: [
    { status: 'shipped', label: 'Mark as shipped', className: 'text-action bg-action/20 hover:bg-action/30' },
    { status: 'cancelled', label: 'Cancel order', className: 'text-destructive bg-destructive/20 hover:bg-destructive/30' },
  ],
  shipped: [
    { status: 'delivered', label: 'Mark as delivered', className: 'text-action bg-action/20 hover:bg-action/30' },
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
    updateStatus.mutate({ itemId, status }, {
      onSuccess: (response) => toast.success(response.message , {
          style: {
            background: 'var(--success)',
            color: 'var(--background)',
            border: 'transparent'
          },
        })
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-action">Incoming Orders</h1>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-30 md:w-45">
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
        <img src="/no_matching_orders.png" alt="No orders match this filter" className='mx-auto md:w-3/5' />
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
                <div className="flex flex-col gap-4 md:flex-row items-center md:items-start justify-between">
                  <div className="flex-1">
                    <p className="flex items-center justify-center gap-2 font-medium text-darker">{item.product.title} <Badge className={`hidden md:block ${status.color}`}>{status.label}</Badge></p>
                    <p className={`flex items-center gap-1 justify-center text-sm p-2 rounded-md mt-2 ${status.color}`}>
                      Qty <span className="font-semibold">{item.quantity}</span> <Dot/> Order <span className="font-semibold">#{item.order.id}</span> <Dot/> {' '}
                      Date <span className="font-semibold">{new Date(item.order.created_at).toLocaleDateString()}</span>
                    </p>
                    <p className={`flex flex-col md:flex-row items-center gap-1 justify-center text-sm p-2 rounded-md mt-2 ${status.color}`}>
                      {item.item_status === 'delivered' ? 'Delivered' : 'Deliver'} to : <span className="font-semibold">{item.order.buyer.name}</span> <Dot/> <span className="font-semibold">{item.order.shipping_address}</span> <Dot/> <span className="font-semibold">{item.order.phone}</span>
                    </p>

                    <div className="mt-5 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6">
                      {actions.length > 0 && (
                        <div className='flex gap-1'>
                          {actions.map((action) => (
                            <Button
                                key={action.status}
                                size="sm"
                                className={action.className}
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
                  <Badge className={`block md:hidden ${status.color}`}>{status.label}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}