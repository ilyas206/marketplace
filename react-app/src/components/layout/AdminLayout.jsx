import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'Overview' },
  { to: '/admin/seller-requests', label: 'Seller Requests' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/complaints', label: 'Complaints' },
];

export default function AdminLayout() {
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
        </nav>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}