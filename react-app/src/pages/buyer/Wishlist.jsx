import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import { toggleWishlist } from '../../api/wishlist';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageOff } from 'lucide-react';
import { Heart } from 'lucide-react';

export default function Wishlist() {
  const { data : wishlist, isLoading } = useWishlist();
  const queryClient = useQueryClient();
  const wishlistCount = wishlist?.data?.length ?? 0;

  const handleRemove = async (product) => {
    await toggleWishlist(product.id); // toggling an already-wishlisted item removes it
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    queryClient.invalidateQueries({ queryKey: ['product', product.slug] });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
      </div>
    );
  }

  if (!wishlist || wishlist.data.length === 0) {
    return (
      <img src="/no_wishlist.png" alt="Your wishlist is empty." className='mx-auto md:w-3/5 max-h-95 mt-6' />
    );
  }

  return (
    <div className="mx-auto md:px-6 py-2">
      <div className='flex items-center justify-center gap-3'>
        <h1 className="text-xl font-semibold text-action">My Wishlist</h1>
        <span className='flex items-center gap-1 bg-destructive/10 py-1 px-3 rounded-md text-destructive font-semibold'>
          <Heart size={18} className='fill-destructive'/> {wishlistCount}
        </span>
      </div>
      <div className="mx-auto py-8 space-y-2">

        {wishlist?.data.map((entry) => (
          <div
            key={entry.id}
            className="relative flex items-center gap-4 rounded-lg border border-borders p-4"
          >
            <div className="h-15 w-15 md:h-20 md:w-20 shrink-0 overflow-hidden rounded bg-borders">
                <Link to={`/products/${entry.product.slug}`}>
                    {entry.product.image ? (
                    <img
                        src={`http://127.0.0.1:8000/storage/${entry.product.image}`}
                        alt={entry.product.title}
                        className="h-15 w-15 md:h-20 md:w-20 rounded-md"
                    />
                    ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        <ImageOff size={30} />
                    </div>
                    )}
                </Link>
            </div>

            <div className="flex-1 min-w-0">
                <Link
                    to={`/products/${entry.product.slug}`}
                    className="font-medium text-darker hover:underline"
                >
                    {entry.product.title}
                </Link>
                <p className="mt-1 text-sm text-slate-500">
                    {entry.product.final_price.toFixed(2)} MAD
                </p>
                {!entry.product.in_stock && (
                    <p className="text-xs text-destructive">Out of stock</p>
                )}
            </div>

            <Button
                variant="destructive"
                onClick={(e) => { e.preventDefault(); handleRemove(entry.product); }}
                >
                Remove
            </Button>
          </div>
        ))}

      </div>
    </div>
  );
}