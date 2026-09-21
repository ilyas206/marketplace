import { useState } from 'react';
import { useBestSelling, useTopCategories, useIncome } from '../../hooks/useSellerStats';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CHART_COLORS = ['#1E3A5F', '#F97316', '#16A34A', '#7C3AED', '#0891B2', '#DC2626'];

export default function SellerStats() {
  const [period, setPeriod] = useState('month');

  const { data: bestSelling, isLoading: loadingBestSelling } = useBestSelling();
  const { data: topCategories, isLoading: loadingCategories } = useTopCategories();
  const { data: income, isLoading: loadingIncome } = useIncome(period);

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-action">Statistics</h1>

      {/* Income over time */}
      <div className="rounded-lg border border-borders p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-medium text-slate-900">Income</h2>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-35">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">Daily</SelectItem>
              <SelectItem value="week" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">Weekly</SelectItem>
              <SelectItem value="month" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loadingIncome && <Skeleton className="h-64 w-full" />}

        {income && income.length === 0 && (
          <img src="/no_delivered_orders.png" alt="No delivered orders yet — income reflects only completed sales." className='mx-auto w-3/5 max-h-95' />
        )}

        {income && income.length > 0 && (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={income}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value} MAD`, 'Income']} />
              <Line type="monotone" dataKey="income" stroke="#1E3A5F" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Best-selling products */}
        <div className="rounded-lg border border-borders p-4">
          <h2 className="mb-4 font-medium text-slate-900">Best-Selling Products</h2>

          {loadingBestSelling && <Skeleton className="h-64 w-full" />}

          {bestSelling && bestSelling.length === 0 && (
            <img src="/no_sales.png" alt="No sales yet." className='mx-auto w-3/5 max-h-95' />
          )}

          {bestSelling && bestSelling.length > 0 && (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bestSelling} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="product.title"
                  tick={{ fontSize: 11 }}
                  width={120}
                />
                <Tooltip formatter={(value) => [value, 'Units sold']} />
                <Bar dataKey="total_sold" fill="#1E3A5F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top categories */}
        <div className="rounded-lg border border-borders p-4">
          <h2 className="mb-4 font-medium text-slate-900">Top Categories</h2>

          {loadingCategories && <Skeleton className="h-64 w-full" />}

          {topCategories && topCategories.length === 0 && (
            <img src="/no_sales.png" alt="No sales yet." className='mx-auto w-3/5 max-h-95' />
          )}

          {topCategories && topCategories.length > 0 && (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topCategories}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [value, 'Units sold']} />
                <Bar dataKey="total_sold" radius={[4, 4, 0, 0]}>
                  {topCategories.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}