import { Link } from 'react-router-dom';
import { useSellerRequests } from '../../hooks/useAdmin';
import { useAdminComplaints } from '../../hooks/useAdmin';
import { useUsers } from '../../hooks/useAdmin';
import { Skeleton } from '@/components/ui/skeleton';
import { FaceAngry, FileUser, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { data: pendingApps, isLoading: l1 } = useSellerRequests();
  const { data: openComplaints, isLoading: l2 } = useAdminComplaints({ status: 'open' });
  const { data: users, isLoading: l3 } = useUsers({ per_page: 1 });

  const cards = [
    { icon: <FileUser size={35} className='text-darker mx-auto' />, label: 'Pending Seller Applications', value: pendingApps?.total, loading: l1, link: '/admin/seller-requests' },
    { icon: <FaceAngry size={35} className='text-darker mx-auto' />, label: 'Open Complaints', value: openComplaints?.total, loading: l2, link: '/admin/complaints' },
    { icon: <Users size={35} className='text-darker mx-auto' />, label: 'Total Users', value: users?.total, loading: l3, link: '/admin/users' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-action">Overview</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} to={card.link} className="rounded-lg border border-borders p-6 hover:shadow-sm">
            {card.icon}
            <p className="text-sm mt-3 text-slate-500">{card.label}</p>
            {card.loading ? <Skeleton className="mt-2 h-8 w-16" /> : (
              <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value ?? 0}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}