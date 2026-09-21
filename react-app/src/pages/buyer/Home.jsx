import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useDebounce } from '../../hooks/useDebounce';
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
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    sort: 'newest',
    page: 1,
  });

  const debouncedSearch = useDebounce(searchInput, 400);

  const { data, isLoading, isError } = useProducts({
    ...filters,
    search: debouncedSearch,
  });
  const { data: categories } = useCategories();

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, page: 1 })); // reset page when search changes too
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {
        user && <h2 className="text-2xl font-bold text-start text-action">Hi, {user.name}</h2>
      }
      <div className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm text-darker"
        />

        <div className="flex gap-3">
          <Select value={filters.category} onValueChange={(v) => updateFilter('category', v)}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">All categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug} className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">
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
              <SelectItem value="newest" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">Newest</SelectItem>
              <SelectItem value="price_asc" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">Price: Low to High</SelectItem>
              <SelectItem value="price_desc" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">Price: High to Low</SelectItem>
              <SelectItem value="rating" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">Top Rated</SelectItem>
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
        <img src="/products_loading_error.png" alt="Couldn't load products. Try refreshing the page.." className='mx-auto w-2/5 max-h-95' />
      )}

      {data && data.data.length === 0 && (
        <img src="/no_matching_products.png" alt="No products match your search." className='mx-auto w-2/5 max-h-95' />
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