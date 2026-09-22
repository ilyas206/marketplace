import { Link, useNavigate } from 'react-router-dom';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '../../hooks/useCart';
import { useAuthStore } from '../../store/authStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ImageOff, ShoppingCartMinus } from 'lucide-react';
import { toast } from "sonner";

export default function Cart() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <img src="/empty_cart.png" alt="Your cart is empty" className='mx-auto md:w-3/5 max-h-95 mt-6' />
    );
  }

  const handleQuantityChange = (itemId, newQty, maxStock) => {
    if (newQty < 1 || newQty > maxStock) return;
    updateItem.mutate({ itemId, quantity: newQty });
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/buyer/checkout' } });
      return;
    }
    navigate('/buyer/checkout');
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-xl font-bold text-action">Your Cart</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col md:flex-row items-center gap-4 rounded-lg border border-borders p-4"
          >
            <div className="h-30 w-30 md:h-20 md:w-20 shrink-0 overflow-hidden rounded bg-borders">
              {item.product.image ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${item.product.image}`}
                  alt={item.product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  <ImageOff size={30} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                to={`/products/${item.product.slug}`}
                className="font-medium text-darker hover:underline"
              >
                {item.product.title}
              </Link>
              <p className="mt-1 text-sm text-slate-500">
                {item.product.final_price.toFixed(2)} MAD each
              </p>
              {item.quantity > item.product.stock && (
                <p className="mt-3 text-xs font-semibold text-destructive">
                  Only {item.product.stock} left — please adjust quantity.
                </p>
              )}
            </div>

            <div className="flex items-center rounded border border-slate-200">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.product.stock)}
                className="px-2 py-1 text-slate-600 hover:bg-borders"
                disabled={updateItem.isPending}
              >
                -
              </button>
              <span className="w-8 text-center text-action text-sm">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.product.stock)}
                className="px-2 py-1 text-slate-600 hover:bg-borders"
                disabled={updateItem.isPending}
              >
                +
              </button>
            </div>

            <p className="w-30 font-medium text-action">
              {item.subtotal.toFixed(2)} MAD
            </p>

            <button
              onClick={() => removeItem.mutate(item.id, {onSuccess: () => toast.error('Item removed from Cart successfully.' , {style: {background: 'var(--destructive)', color: 'var(--background)', border: 'transparent'} })})}
              className="absolute top-2 right-4 text-slate-400 hover:text-destructive"
              disabled={removeItem.isPending}
              aria-label="Remove item"
            >
              <ShoppingCartMinus size={17} />
            </button>
          </div>
        ))}
      </div>

      <Separator className="my-6 bg-action" />

      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-darker">Total</span>
        <span className="text-xl font-bold text-darker">{cart.total.toFixed(2)} MAD</span>
      </div>

      <Button onClick={handleCheckout} className="mt-6 w-full bg-action hover:bg-darker" size="lg">
        Proceed to Checkout
      </Button>

      {!isAuthenticated && (
        <p className="mt-2 text-center text-sm text-slate-500">
          You'll need to log in to complete your purchase.
        </p>
      )}
    </div>
  );
}