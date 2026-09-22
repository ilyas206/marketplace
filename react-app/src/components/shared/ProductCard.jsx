import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ImageOff, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const hasDiscount = product.discount_price !== null;
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-borders bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-slate-100">
        {product.primary_image ? (
          <img
            src={`http://127.0.0.1:8000/storage/${product.primary_image}`}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col h-full items-center justify-center gap-2 text-xs md:text-lg text-slate-400">
            <ImageOff size={35} />
            No image
          </div>
        )}
        

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70"></div>
        )}

        {hasDiscount && !isOutOfStock && (
          <Badge className="absolute left-2 top-2 bg-success text-xs font-bold">
            -{Math.round((1 - product.discount_price / product.price) * 100)}%
          </Badge>
        )}
      </div>

      <div className="space-y-3 p-3">
        <h3 className="line-clamp-2 text-sm font-bold text-darker">
          {product.title}
        </h3>

        <div className="flex justify-center items-baseline gap-2">
          {
            isOutOfStock 
            ? <Badge variant="secondary">Out of stock</Badge> 
            : <>
              <span className={`font-semibold text-xs md:text-lg ${hasDiscount ? 'text-success' : 'text-orange'}`}>
                {product.final_price.toFixed(2)} MAD
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {product.price.toFixed(2)}
                </span>
              )}
            </>
          }
        </div>

        {product.average_rating > 0 && (
          <div className="flex items-center justify-center gap-1 text-action">
            <Star size={15} className='fill-amber-400 stroke-0' /> 
            <span className='text-xs font-medium'>{product.average_rating} rating</span>
          </div>
        )}
      </div>
    </Link>
  );
}