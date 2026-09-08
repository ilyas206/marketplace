import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function ProductCard({ product }) {
  const hasDiscount = product.discount_price !== null;
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-slate-100">
        {product.primary_image ? (
          <img
            src={`http://127.0.0.1:8000/storage/${product.primary_image}`}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 text-sm">
            No image
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Badge variant="secondary">Out of stock</Badge>
          </div>
        )}

        {hasDiscount && !isOutOfStock && (
          <Badge className="absolute left-2 top-2 bg-accent hover:bg-accent">
            -{Math.round((1 - product.discount_price / product.price) * 100)}%
          </Badge>
        )}
      </div>

      <div className="space-y-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-slate-900">
          {product.title}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-slate-900">
            {product.final_price.toFixed(2)} MAD
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">
              {product.price.toFixed(2)} MAD
            </span>
          )}
        </div>

        {product.average_rating > 0 && (
          <div className="text-xs text-slate-500">
            ★ {product.average_rating} rating
          </div>
        )}
      </div>
    </Link>
  );
}