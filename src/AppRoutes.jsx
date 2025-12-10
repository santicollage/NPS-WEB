import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LoadingScreen from './components/LoadingScreen';

// Lazy load all page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminProductDetail = lazy(() => import('./pages/AdminProductDetail'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminOrderDetail = lazy(() => import('./pages/AdminOrderDetail'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AppRoutes = () => {
  const location = useLocation();
  const state = location.state;

  return (
    <Suspense fallback={<LoadingScreen />}>
      {/* Main Routes */}
      <Routes location={state?.backgroundLocation || location}>
        {/* Public Routes - Accessible to everyone */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Auth Routes - Only accessible when NOT authenticated */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Routes - Require authentication */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requireAuth>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Require authentication AND admin role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAuth requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requireAuth requireAdmin>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/:id"
          element={
            <ProtectedRoute requireAuth requireAdmin>
              <AdminProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requireAuth requireAdmin>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute requireAuth requireAdmin>
              <AdminOrderDetail />
            </ProtectedRoute>
          }
        />

        {/* Special Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Modal Routes - Only render when there's a background location */}
      {state?.backgroundLocation && (
        <>
          <Routes>
            <Route path="/products/:id" element={<ProductDetail modal />} />
            <Route
              path="/admin/products/:id"
              element={
                <ProtectedRoute requireAuth requireAdmin>
                  <AdminProductDetail modal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <ProtectedRoute requireAuth requireAdmin>
                  <AdminOrderDetail modal />
                </ProtectedRoute>
              }
            />
          </Routes>
        </>
      )}
    </Suspense>
  );
};

export default AppRoutes;
