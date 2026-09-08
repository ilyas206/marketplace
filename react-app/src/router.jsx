import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/shared/ProtectedRoute';

import Home from './pages/buyer/Home';
import ProductDetail from './pages/buyer/ProductDetail';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import OrderHistory from './pages/buyer/OrderHistory';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import SellerDashboard from './pages/seller/Dashboard';
import SellerProducts from './pages/seller/Products';
import SellerOrderItems from './pages/seller/OrderItems';
import SellerStats from './pages/seller/Stats';

import AdminDashboard from './pages/admin/Dashboard';
import SellerRequests from './pages/admin/SellerRequests';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';

function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element : <RootLayout/>,
    children : [
      // Public routes — no login required (matches your "guests see full details" decision)
      { path: '/', element: <Home /> },
      { path: '/products/:slug', element: <ProductDetail /> },
      { path: '/cart', element: <Cart /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },

      // Buyer-only (any authenticated user, checkout requires login per your design)
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/checkout', element: <Checkout /> },
          { path: '/orders', element: <OrderHistory /> },
        ],
      },

      // Seller-only
      {
        element: <ProtectedRoute allowedRoles={['seller']} />,
        children: [
          { path: '/seller/dashboard', element: <SellerDashboard /> },
          { path: '/seller/products', element: <SellerProducts /> },
          { path: '/seller/orders', element: <SellerOrderItems /> },
          { path: '/seller/stats', element: <SellerStats /> },
        ],
      },

      // Admin-only
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          { path: '/admin/dashboard', element: <AdminDashboard /> },
          { path: '/admin/seller-requests', element: <SellerRequests /> },
          { path: '/admin/categories', element: <AdminCategories /> },
          { path: '/admin/users', element: <AdminUsers /> },
        ],
      },
    ]
  }
]);
