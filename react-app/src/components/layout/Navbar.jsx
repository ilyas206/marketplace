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

  const { data: conversations } = useConversations({ enabled: isAuthenticated() });
  const totalUnread = conversations?.reduce((sum, c) => sum + c.unread_count, 0) ?? 0;

  return (
    <nav className="flex items-center justify-between bg-action text-background p-2 text-sm">
      <Link to="/" className='w-1/6 md:w-3/6'>
        <img src="/logo.png" className='md:w-1/5'/>
      </Link>

      <div className="flex items-center justify-evenly w-5/6 md:w-3/6">
        {
          (!isAuthenticated() || (!hasRole('seller') && !hasRole('admin'))) && <Link to="/cart" className='flex items-center gap-1 font-medium text-xs md:text-md'>
            {itemsCount}
            <ShoppingCart size={18} />
          </Link>
        }

        {isAuthenticated() ? (
          <>
            {(hasRole('buyer') && !hasRole('seller')) && <Link to="/buyer/orders" className='font-medium text-xs md:text-md'>Buyer Portal</Link>}
            {hasRole('seller') && <Link to="/seller/dashboard" className='font-medium text-xs md:text-md'>Seller Dashboard</Link>}
            {hasRole('admin') && <Link to="/admin/dashboard" className='font-medium text-xs md:text-md'>Admin Dashboard</Link>}
            <Link to="/messages" className="relative font-medium text-xs md:text-md">
              Messages
              {totalUnread > 0 && (
                <span className="absolute -right-2 -top-2 flex h-3 w-3 items-center justify-center rounded-full bg-lighter text-darker text-[10px] font-bold">
                  {totalUnread}
                </span>
              )}
            </Link>
            <Button className='bg-darker text-xs md:text-md' onClick={() => logout.mutate()}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className='font-medium text-xs md:text-md'>Login</Link>
            <Link to="/register" className='font-medium text-xs md:text-md'>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}