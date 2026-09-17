import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';
import { useCartStore } from '../../store/cartStore';
import { useConversations } from '../../hooks/useMessages';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, hasRole } = useAuthStore();
  const logout = useLogout();
  const itemsCount = useCartStore((s) => s.itemsCount);

  const { data: conversations } = useConversations();
  const totalUnread = conversations?.reduce((sum, c) => sum + c.unread_count, 0) ?? 0;

  return (
    <nav className="flex items-center justify-between bg-action text-background p-3 text-sm">
      <Link to="/" className='w-3/6'>
        <img src="/logo.png" className='w-1/5'/>
      </Link>

      <div className="flex items-center justify-evenly w-3/6">
        <Link to="/cart" className='flex items-center gap-1 font-medium'>
          {itemsCount}
          <ShoppingCart size={22} />
        </Link>

        {isAuthenticated() ? (
          <>
            {hasRole('seller') && <Link to="/seller/dashboard" className='font-medium'>Seller Dashboard</Link>}
            {hasRole('admin') && <Link to="/admin/dashboard" className='font-medium'>Admin</Link>}
            {hasRole('buyer') && <Link to="/orders" className='font-medium'>My Orders</Link>}
            <Link to="/messages" className="relative font-medium">
              Messages
              {totalUnread > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-lighter text-darker text-[10px] font-bold">
                  {totalUnread}
                </span>
              )}
            </Link>
            <Button className='bg-darker' onClick={() => logout.mutate()}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className='font-medium'>Login</Link>
            <Link to="/register" className='font-medium'>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}