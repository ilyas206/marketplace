import { Link } from 'react-router-dom';
import { useSellerProducts } from '../../hooks/useSellerProducts';
import { useSellerOrderItems } from '../../hooks/useSellerOrders';
import { useIncome } from '../../hooks/useSellerStats';
import { Skeleton } from '@/components/ui/skeleton';
import { HandCoins, PackageOpen, Shirt } from 'lucide-react';

export default function SellerDashboard() {
  const { data: products, isLoading: loadingProducts } = useSellerProducts({ per_page: 1 });
  const { data: pendingOrders, isLoading: loadingOrders } = useSellerOrderItems({ status: 'pending' });
  const { data: income, isLoading: loadingIncome } = useIncome('month');

  const totalIncome = income?.reduce((sum, row) => sum + parseFloat(row.income), 0) ?? 0;

  const cards = [
    {
      icon: <Shirt size={35} className='text-darker mx-auto' />,
      label: 'Total Products',
      value: products?.total,
      loading: loadingProducts,
      link: '/seller/products',
    },
    {
      icon: <PackageOpen size={35} className='text-darker mx-auto' />,
      label: 'Pending Orders',
      value: pendingOrders?.total,
      loading: loadingOrders,
      link: '/seller/orders',
    },
    {
      icon: <HandCoins size={35} className='text-darker mx-auto' />,
      label: 'Income (this month)',
      value: totalIncome ? `${totalIncome.toFixed(2)} MAD` : '0 MAD',
      loading: loadingIncome,
      link: '/seller/stats',
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-action">Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="rounded-lg border border-borders p-6 hover:shadow-sm"
          >
            {card.icon}
            <p className="text-sm mt-3 text-slate-500">{card.label}</p>
            {card.loading ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : (
              <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value ?? 0}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}