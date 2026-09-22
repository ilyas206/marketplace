import { useParams } from 'react-router-dom';
import { useSellerPublicProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/shared/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function SellerStorefront() {
  const { sellerId } = useParams();
  const { data, isLoading } = useSellerPublicProducts(sellerId);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold text-action">Seller's Products</h1>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
        </div>
      )}

      {data && data.data.length === 0 && (
        <img src="/no_seller_products.png" alt="This seller has no active products." className='mx-auto w-2/5 max-h-95 mt-20' />
      )}

      {data && data.data.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {data.data.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}