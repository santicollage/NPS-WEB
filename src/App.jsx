import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { refreshSession, fetchCurrentUser } from './store/slices/userSlice';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import Background from './components/Background';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminProductDetail from './pages/AdminProductDetail';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetail from './pages/AdminOrderDetail';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import ContactButton from './components/ContactButton';

// Modal Routes Component
const ModalRoutes = () => {
  const location = useLocation();
  const state = location.state;

  return (
    <>
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
          </Routes>
          <Routes>
            <Route
              path="/admin/products/:id"
              element={
                <ProtectedRoute requireAuth requireAdmin>
                  <AdminProductDetail modal />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Routes>
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
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const hideFooterRoutes = ['/login'];
  const showFooter = !hideFooterRoutes.includes(location.pathname);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(refreshSession()).unwrap();
        // Si refresh fue exitoso, obtener datos del usuario
        dispatch(fetchCurrentUser());
      } catch {
        // Refresh falló, usuario no está autenticado
        console.log('No hay sesión activa');
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <>
      <Background />
      <Navbar />
      <ContactButton />
      <ModalRoutes />
      {showFooter && <Footer />}
    </>
  );
}

export default App;
