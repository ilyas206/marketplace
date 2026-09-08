import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import ProductCard from '../../components/shared/ProductCard';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '../../store/authStore';

export default function Home() {
  const { user } = useAuthStore()
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'newest',
    page: 1,
  });

  const { data, isLoading, isError } = useProducts(filters);
  const { data: categories } = useCategories();

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <h2 className="text-start">Hi, {user.name}</h2>
      <div className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="max-w-sm"
        />

        <div className="flex gap-3">
          <Select value={filters.category} onValueChange={(v) => updateFilter('category', v)}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sort} onValueChange={(v) => updateFilter('sort', v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-slate-500 py-12">
          Couldn't load products. Try refreshing the page.
        </p>
      )}

      {data && data.data.length === 0 && (
        <p className="text-center text-slate-500 py-12">
          No products match your search.
        </p>
      )}

      {data && data.data.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {data?.meta && data.meta.last_page > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: data.meta.last_page }).map((_, i) => (
            <button
              key={i}
              onClick={() => setFilters((prev) => ({ ...prev, page: i + 1 }))}
              className={`h-8 w-8 rounded text-sm ${
                filters.page === i + 1
                  ? 'bg-brand text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}