import { useMyReviews, useDeleteReview } from '../../hooks/useReviews';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MyReviews() {
  const { data, isLoading } = useMyReviews();
  const deleteReview = useDeleteReview();
  const [deletingReview, setDeletingReview] = useState(null);

  if (isLoading) {
    return <div className="mx-auto max-w-2xl px-6 py-8 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;
  }

  if (!data || data.data.length === 0) {
    return <img src="/no_own_reviews.png" alt="No own reviews." className='mx-auto md:w-3/5 max-h-95 mt-6' />
  }

  return (
    <div className="mx-auto md:px-6 py-2">
      <h1 className="mb-6 text-xl font-semibold text-action">My Reviews</h1>
      <div className="space-y-3">
        {data.data.map((review) => (
          <div key={review.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className='flex flex-col items-start space-y-1'>
                <Link to={`/products/${review.product?.slug}`} className="font-medium text-slate-900 hover:underline">
                  {review.product?.title}
                </Link>
                <div className="flex text-amber-400" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={16}
                      fill={index < review.rating ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <p className="mt-1 text-sm font-light text-start text-slate-600">{review.comment}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setDeletingReview(review.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!deletingReview} onOpenChange={(open) => !open && setDeletingReview(null)}>
        <DialogContent>
            <DialogHeader><DialogTitle>Removing Review</DialogTitle></DialogHeader>
            <DialogDescription>
                Are you sure you want to remove this review ?
            </DialogDescription>
            <DialogFooter className="border-t-borders">
                <DialogClose>
                    <Button size="sm" variant="outline" className="w-full">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteReview.isPending}
                  onClick={() => deleteReview.mutate(deletingReview, {
                    onSuccess: (response) => {
                      setDeletingReview(null);
                      toast.success(response.message, {
                        style: {
                          background: 'var(--success)',
                          color: 'var(--background)',
                          border: 'transparent',
                        },
                      });
                    },
                  })}
                >
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}