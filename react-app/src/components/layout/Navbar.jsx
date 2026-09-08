import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';
import { useCartStore } from '../../store/cartStore';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, hasRole } = useAuthStore();
  const logout = useLogout();
  const itemsCount = useCartStore((s) => s.itemsCount);

  return (
    <nav className="flex items-center justify-between bg-accent p-3 text-white text-sm">
      <Link to="/" className="font-bold text-lg">
        <img src="/logo.png" className='w-1/7'/>
      </Link>

      <div className="flex items-center gap-10">
        <Link to="/cart" className='flex items-center gap-2 font-medium'>
          {itemsCount}
          <ShoppingCart size={22} />
        </Link>

        {isAuthenticated() ? (
          <>
            {hasRole('seller') && <Link to="/seller/dashboard">Seller Dashboard</Link>}
            {hasRole('admin') && <Link to="/admin/dashboard">Admin</Link>}
            {hasRole('buyer') && <Link to="/orders">My Orders</Link>}
            <Button size="sm" onClick={() => logout.mutate()}>
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