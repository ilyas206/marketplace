import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useCheckout } from '../../hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Checkout() {
  const { data: cart, isLoading } = useCart();
  const checkout = useCheckout();
  const navigate = useNavigate();

  const [form, setForm] = useState({ shipping_address: '', phone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    checkout.mutate(form, {
      onSuccess: (data) => {
        navigate(`/buyer/orders/${data.order.id}`, { state: { justPlaced: true } });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <img src="/no_checkout.png" alt="Nothing to checkout" className='mx-auto w-3/5 max-h-95 mt-6' />
    );
  }

  const errorMessage = checkout.error?.response?.data?.message;

  return (
    <div className="mx-auto max-w-4xl md:px-4 py-2">
      <h1 className="mb-6 text-xl font-bold text-action">Checkout</h1>

      <div className="grid grid-cols-1 gap-15 md:grid-cols-2">
        {/* Order summary */}
        <div>
          <h2 className="mb-3 text-sm font-medium text-slate-500">Order Summary</h2>
          <div className="space-y-3 rounded-lg border border-slate-200 p-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="font-semibold text-slate-700">
                  {item.product.title} × {item.quantity}
                </span>
                <span className="font-medium text-darker">
                  {item.subtotal.toFixed(2)} MAD
                </span>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between font-semibold text-darker">
              <span>Total</span>
              <span>{cart.total.toFixed(2)} MAD</span>
            </div>

            <p className="text-xs text-slate-500">Payment: Cash on Delivery</p>
          </div>
        </div>

        {/* Shipping form */}
        <div>
          <h2 className="mb-3 text-sm font-medium text-slate-500">Shipping Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="shipping_address">Delivery address</Label>
              <Input
                id="shipping_address"
                placeholder="Street, city, area..."
                value={form.shipping_address}
                onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                className="text-darker"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06XXXXXXXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="text-darker"
                required
              />
            </div>

            {errorMessage && (
              <p className="text-sm font-semibold text-destructive">{errorMessage}</p>
            )}

            <Button type="submit" className="w-full bg-action hover:bg-darker" size="lg" disabled={checkout.isPending}>
              {checkout.isPending ? 
                'Placing order...' : 
                `Place Order — ${cart.total.toFixed(2)} MAD`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}