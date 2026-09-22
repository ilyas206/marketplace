import { useMemo, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrders';
import { useSubmitReview } from '../../hooks/useReviews';
import { useFileComplaint } from '../../hooks/useComplaints';
import { useCancelOrderItem } from '../../hooks/useOrders';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CircleX, Dot, MessagesSquare, Star, TriangleAlert, UserStar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

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
  const [reviewingProduct, setReviewingProduct] = useState(null);
  const [cancelingItem, setCancelingItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const submitReview = useSubmitReview();
  const cancelItem = useCancelOrderItem();

  // Derive the unique sellers involved in this order
  const uniqueSellers = useMemo(() => (
    order?.items?.reduce((acc, item) => {
      if (!acc.find((seller) => seller.id === item.seller.id)) acc.push(item.seller);
      return acc;
    }, []) ?? []
  ), [order]);

  const [complaintOpen, setComplaintOpen] = useState(false);
  const [complaintForm, setComplaintForm] = useState({ subject: '', description: '', seller_id: '' });
  const fileComplaint = useFileComplaint();

  const handleSubmitReview = () => {
    submitReview.mutate(
      { product_id: reviewingProduct.id, rating, comment },
      { onSuccess: () => { setReviewingProduct(null); setComment(''); setRating(5); toast.success('Review added successfully.' , {
          style: {
            background: 'var(--success)',
            color: 'var(--background)',
            border: 'transparent'
          },
        }) 
      }}
    );
  };

  const handleFileComplaint = () => {
    fileComplaint.mutate(
      { order_id: order.id, seller_id: complaintForm.seller_id || uniqueSellers[0]?.id || null, subject: complaintForm.subject, description: complaintForm.description },
      { onSuccess: () => { setComplaintOpen(false); setComplaintForm({ subject: '', description: '' }); toast.success('Complaint filed successfully.' , {
          style: {
            background: 'var(--success)',
            color: 'var(--background)',
            border: 'transparent'
          },
        })
      }}
    );
  };

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
    <div className="mx-auto md:px-4 py-2">
      {location.state?.justPlaced && (
        <div className="mb-6 rounded-lg bg-success/10 p-4 text-success font-semibold">
          Order placed successfully. You'll be notified as it progresses.
        </div>
      )}

      <div className="mb-6 flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-semibold text-action">Order #{order.id}</h1>
          <p className="text-sm text-slate-500">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
          <Button variant="ghost" size="sm" onClick={() => setComplaintOpen(true)} className="mt-2 hover:text-destructive">
            Report an issue <TriangleAlert />
          </Button>
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
              className="flex flex-col-reverse gap-3 md:flex-row items-center justify-between rounded-lg border border-slate-200 p-4"
            >
              <div>
                <Link
                  to={`/products/${item.product.slug}`}
                  className="font-medium text-slate-900 hover:underline"
                >
                  {item.product.title}
                </Link>
                <p className="flex  items-center gap-1 mt-2 text-sm text-slate-500">
                  Qty <span className='font-semibold'>{item.quantity}</span> <Dot size={20}/> <span className='font-semibold'>{item.unit_price}</span> MAD each <Dot size={20}/> Sold by <span className='font-semibold'>{item.seller.name}</span>
                </p>
                <div className='flex items-center justify-center gap-1'>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                    onClick={() => navigate(`/messages/${item.seller.id}?order=${order.id}`)}
                  >
                    Message Seller <MessagesSquare />
                  </Button>
                  {item.item_status === 'delivered' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 hover:text-amber-400"
                      onClick={() => setReviewingProduct({ id: item.product.id, })}
                    >
                      Write a review <UserStar />
                    </Button>
                  )}
                  {item.item_status === 'pending' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3 hover:text-destructive"
                      onClick={() => setCancelingItem(item.id)}
                    >
                      Cancel item <CircleX />
                    </Button>
                  )}
                </div>
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

      <Dialog open={!!reviewingProduct} onOpenChange={(open) => !open && (setReviewingProduct(null), setRating(5), setComment(''))}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rate this product</DialogTitle></DialogHeader>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} className="text-2xl">
                {n <= rating ? <Star className='fill-amber-400 stroke-0'/> : <Star className='fill-slate-200 stroke-0'/>}
              </button>
            ))}
          </div>
          <Textarea placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
          {submitReview.error && (
            <p className="text-sm font-semibold text-destructive">
              {submitReview.error.response?.data?.errors?.product_id?.[0] ?? 'Could not submit review.'}
            </p>
          )}
          <Button onClick={handleSubmitReview} disabled={submitReview.isPending} className="w-full bg-action hover:bg-darker">
            Submit Review
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={!!cancelingItem} 
        onOpenChange={(open) => !open && setCancelingItem(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className='text-darker'>Cancel Order Item</DialogTitle>
          </DialogHeader>
            <DialogDescription>
                Are you sure you want to cancel this Item ?
            </DialogDescription>
            <DialogFooter className="border-t-borders">
                <DialogClose>
                    <Button size="sm" variant="outline" className="w-full">Return</Button>
                </DialogClose>
                <Button 
                  onClick={() => {
                    cancelItem.mutate(cancelingItem, {
                      onSuccess: (response) => {
                        setCancelingItem(null)
                        toast.error(response.message, {
                          style: {
                            background: 'var(--destructive)',
                            color: 'var(--background)',
                            border: 'transparent'
                          },
                        })
                      }
                    })
                  }} 
                  disabled={cancelItem.isPending} 
                  size="sm" 
                  className="bg-destructive/50 hover:bg-destructive">
                    {
                        cancelItem.isPending ? 'Canceling...' : 'Cancel'
                    }
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={complaintOpen} onOpenChange={setComplaintOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Report an issue with this order</DialogTitle></DialogHeader>
          {uniqueSellers.length > 1 && (
            <div className="space-y-1">
              <Label className="text-xs">Which seller is this about?</Label>
              <Select
                value={complaintForm?.seller_id?.toString()}
                onValueChange={(v) => setComplaintForm({ ...complaintForm, seller_id: v })}
              >
                <SelectTrigger className="w-full"><SelectValue placeholder="Select a seller" /></SelectTrigger>
                <SelectContent>
                  {uniqueSellers.map((s) => (
                    <SelectItem 
                    key={s.id} 
                    value={s.id}
                    className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!"
                    >{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Input
            placeholder="The Subject"
            value={complaintForm.subject}
            onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
            required
          />
          {fileComplaint.error &&
            <p className="text-sm font-semibold text-destructive">
              {fileComplaint.error.response?.data?.errors.subject[0] ?? 'Could not submit review.'}
            </p>
          }
          <Textarea
            placeholder="Describe the issue..."
            value={complaintForm.description}
            onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
            rows={4}
            required
          />
          {fileComplaint.error &&
            <p className="text-sm font-semibold text-destructive">
              {fileComplaint.error.response?.data?.errors.description[0] ?? 'Could not submit review.'}
            </p>
          }
          <Button onClick={handleFileComplaint} disabled={fileComplaint.isPending || (uniqueSellers.length > 1 && !complaintForm.seller_id)} className="w-ful bg-action hover:bg-darkerl">
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}