import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useRelatedProducts } from '../../hooks/useProducts';
import { useAddToCart } from '../../hooks/useCart';
import { useToggleWishlist } from '../../hooks/useWishlist';
import { useProductReviews } from '../../hooks/useReviews';
import { useAuthStore } from '../../store/authStore';
import ProductCard from '../../components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner";
import { Dot, Heart, ImageOff, ShoppingCartPlus, Star, MessagesSquare } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(slug);
  const { data: related } = useRelatedProducts(slug);
  const { data: reviews } = useProductReviews(slug);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { isAuthenticated, hasRole } = useAuthStore();

  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist(slug);

  useEffect(() => {
    if (addToCart.isError) {
      toast.error(addToCart.error?.response?.data?.message ?? 'Could not add to cart.', {
        style: {
          background: 'var(--destructive)',
          color: 'var(--background)',
          border: '1px solid var(--borders)',
        },
      });
    }
  }, [addToCart.isError, addToCart.error]);

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const hasDiscount = product.discount_price !== null;

  const handleAddToCart = () => {
    addToCart.mutate({ product_id: product.id, quantity }, {
      onSuccess: () => toast.success('Product added to cart successfully.' , {
          style: {
            background: 'var(--success)',
            color: 'var(--background)',
            border: 'transparent'
          },
        })
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
        {/* Image gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
            {product?.images?.length > 0 ? (
              <img
                src={product.images[activeImage].url}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <ImageOff size={100} />
              </div>
            )}
          </div>

          {product?.images?.length > 1 && (
            <div className="mt-3 flex justify-center gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`h-13 w-13 overflow-hidden rounded-md border-3 ${
                    activeImage === i ? 'border-action' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-lg font-bold text-action">{product.category.name}</p>
          <Separator className="my-4 bg-borders" />
          <h1 className="mt-3 text-2xl font-semibold text-darker">{product.title}</h1>

          {product.average_rating > 0 && (
            <div className="flex items-center justify-center gap-1 mt-1 mb-5 text-sm text-slate-500">
              <Star size={16} className='fill-amber-400 stroke-0' /> 
              {product.average_rating}
              <Dot size={20} />
              {product.reviews_count} reviews
            </div>
          )}

          <div className="mt-4 flex justify-center items-baseline gap-3">
            <span className="text-3xl font-bold text-darker">
              {product.final_price.toFixed(2)} MAD
            </span>
            {hasDiscount && (
              <span className="text-md text-slate-400 line-through">
                {product.price.toFixed(2)} MAD
              </span>
            )}
          </div>

          <p className={`mt-2 text-sm font-medium ${product.in_stock ? 'text-success' : 'text-destructive'}`}>
            {product.in_stock ? `In stock (${product.stock} available)` : 'Out of stock'}
          </p>

          <Separator className="my-4 bg-borders" />

          <p className="text-sm font-light text-slate-600 leading-relaxed">{product.description}</p>


          {/* Quantity + actions */}
          {product.in_stock && (
            <>
              {
                (!hasRole('seller') && !hasRole('admin')) && <>
                  <Separator className="my-4 bg-borders" />
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-md border border-borders">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-1 text-slate-600 hover:bg-borders"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-action">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        className="px-3 py-1 text-slate-600 hover:bg-borders"
                      >
                        +
                      </button>
                    </div>

                    <Button onClick={handleAddToCart} disabled={addToCart.isPending} className="bg-action hover:bg-darker flex-1">
                      {addToCart.isPending ? 
                        'Adding...' : 
                        <div className='flex items-center gap-2'>
                          <ShoppingCartPlus size={30}/>
                          <span>Add to Cart</span>
                        </div>}
                    </Button>

                    {isAuthenticated() && (
                      <Button
                        variant="outline"
                        className="border-borders"
                        onClick={() => toggleWishlist.mutate(product.id, {onSuccess: (response) => toast.success(response.message , { style: {background: 'var(--success)', color: 'var(--background)', border: 'transparent'} })})}
                        disabled={toggleWishlist.isPending}
                      >
                        {
                          product.is_wishlisted ? 
                          <Heart className='fill-destructive text-destructive' strokeWidth={1} /> : 
                          <Heart className='text-darker' strokeWidth={1} />
                        }
                      </Button>
                    )}
                  </div>
                </>
              }
            </>
          )}

          {/* Seller info */}
          <div className="rounded-lg border border-borders p-4 space-y-1 mt-4">
            <p className="text-sm text-slate-500">Sold by</p>
            <p className="font-medium text-slate-900">{product.seller.business_name}</p>
            <p className="text-sm text-slate-500">{product.seller.total_products} products</p>

            {(isAuthenticated() && !hasRole('seller')) && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => navigate(`/messages/${product.seller.id}`)}
              >
                Message Seller <MessagesSquare />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Product reviews */}
      <div className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-action">
          Reviews {product.reviews_count > 0 && `(${product.reviews_count})`}
        </h2>

        {reviews && reviews.data.length === 0 && (
          <img src="/no_reviews.png" alt="No reviews yet." className='mx-auto w-2/5 max-h-95 mt-8' />
        )}

        {reviews && reviews.data.length > 0 && (
          <div className="space-y-4">
            {reviews.data.map((review) => (
              <div key={review.id} className="border-b border-borders pb-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-medium text-slate-900">{review.buyer_name}</span>
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
                </div>
                {review.comment && <p className="mt-1 text-sm text-slate-600">{review.comment}</p>}
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      {related?.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-action">Related products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}