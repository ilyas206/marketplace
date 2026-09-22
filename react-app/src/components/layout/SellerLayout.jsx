import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getSupportContact } from '../../api/users';
import { toast } from 'sonner';

const links = [
  { to: '/seller/dashboard', label: 'Overview' },
  { to: '/seller/products', label: 'Products' },
  { to: '/seller/orders', label: 'Orders' },
  { to: '/seller/stats', label: 'Statistics' },
  { to: '/seller/complaints', label: 'Complaints' }
];

export default function SellerLayout() {
  const navigate = useNavigate();

  const handleContactSupport = async () => {
    try {
      const { id } = await getSupportContact();
      navigate(`/messages/${id}`);
    } catch {
      toast.error('Support contact unavailable right now.', {
        style: {
          background: 'var(--destructive)',
          color: 'var(--background)',
          border: 'transparent'
        },
      })
    }
  };

  return (
    <div className="mx-auto flex flex-col md:flex-row max-w-7xl gap-8 px-6 py-7">
      <aside className="w-full md:w-48 h-full shrink-0 bg-lighter rounded-md p-2">
        <nav className="space-y-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm font-semibold transition duration-300 ${
                  isActive
                    ? 'text-action hover:bg-white/40'
                    : 'text-white hover:bg-action/40'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={handleContactSupport}
            className="block w-full rounded px-3 py-2 text-sm font-semibold cursor-pointer transition duration-300 text-white hover:bg-action/40"
          >
            Contact Support
          </button>
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}