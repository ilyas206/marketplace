import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/seller/dashboard', label: 'Overview' },
  { to: '/seller/products', label: 'Products' },
  { to: '/seller/orders', label: 'Orders' },
  { to: '/seller/stats', label: 'Statistics' },
];

export default function DashboardLayout() {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-6 py-7">
      <aside className="w-48 h-96 shrink-0 bg-lighter rounded-md p-2">
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
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}