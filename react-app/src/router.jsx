import { createBrowserRouter, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Messages from './pages/shared/Messages';
import Navbar from './components/layout/Navbar';
import SellerLayout from './components/layout/SellerLayout';
import AdminLayout from './components/layout/AdminLayout';
import BuyerLayout from './components/layout/BuyerLayout';

import Home from './pages/buyer/Home';
import ProductDetail from './pages/buyer/ProductDetail';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import OrderHistory from './pages/buyer/OrderHistory';
import OrderDetail from './pages/buyer/OrderDetail';
import BecomeSeller from './pages/buyer/BecomeSeller';
import MyReviews from './pages/buyer/MyReviews';
import MyComplaints from './pages/buyer/MyComplaints';
import Wishlist from './pages/buyer/Wishlist';
import SellerStorefront from './pages/buyer/SellerStorefront';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import SellerDashboard from './pages/seller/Dashboard';
import SellerProducts from './pages/seller/Products';
import SellerOrderItems from './pages/seller/OrderItems';
import SellerStats from './pages/seller/Stats';
import SellerComplaints from './pages/seller/Complaints';

import AdminDashboard from './pages/admin/Dashboard';
import SellerRequests from './pages/admin/SellerRequests';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';
import AdminProducts from './pages/admin/Products';
import AdminComplaints from './pages/admin/Complaints';

import { useCart } from './hooks/useCart';
import { Toaster } from "@/components/ui/sonner";
import FileComplaint from './pages/buyer/FileComplaint';

function RootLayout() {
  useCart(); // fetches cart on app load, keeps itemsCount in sync via onSuccess
  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster/>
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
      { path: '/sellers/:sellerId/products', element: <SellerStorefront /> },
      { path: '/cart', element: <Cart /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },

      // any authenticated user, checkout requires login per your design
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/messages', element: <Messages /> },
          { path: '/messages/:userId', element: <Messages /> },
        ],
      },

      // Buyer-only
      {
        element: <ProtectedRoute allowedRoles={['buyer']} />,
        children: [
          {
            element : <BuyerLayout/>,
            children : [
              { path: '/buyer/orders', element: <OrderHistory /> },
              { path: '/buyer/orders/:id', element: <OrderDetail /> },
              { path: '/buyer/checkout', element: <Checkout /> },
              { path: '/buyer/become-seller', element: <BecomeSeller /> },
              { path: '/buyer/my-reviews', element: <MyReviews /> },
              { path: '/buyer/my-complaints', element: <MyComplaints /> },
              { path: '/buyer/file-complaint', element: <FileComplaint /> },
              { path: '/buyer/wishlist', element: <Wishlist /> },
            ]
          }
        ],
      },

      // Seller-only
      {
        element: <ProtectedRoute allowedRoles={['seller']} />,
        children: [
          {
            element : <SellerLayout/>,
            children : [
              { path: '/seller/dashboard', element: <SellerDashboard /> },
              { path: '/seller/products', element: <SellerProducts /> },
              { path: '/seller/orders', element: <SellerOrderItems /> },
              { path: '/seller/stats', element: <SellerStats /> },
              { path: '/seller/complaints', element: <SellerComplaints /> },
            ] 
          }
        ],
      },

      // Admin-only
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            element : <AdminLayout/>,
            children : [
              { path: '/admin/dashboard', element: <AdminDashboard /> },
              { path: '/admin/seller-requests', element: <SellerRequests /> },
              { path: '/admin/categories', element: <AdminCategories /> },
              { path: '/admin/products', element: <AdminProducts /> },
              { path: '/admin/users', element: <AdminUsers /> },
              { path: '/admin/complaints', element: <AdminComplaints /> },
            ]
          }
        ],
      },
    ]
  }
]);
