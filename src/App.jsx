import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshSession, fetchCurrentUser } from './store/slices/userSlice';
import { fetchCart } from './store/slices/cartSlice';
import { selectIsLoading } from './store/slices/loadingSelectors';
import { startLoading, stopLoading } from './store/slices/loadingSlice';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import Background from './components/Background';
import LoadingScreen from './components/LoadingScreen';
import ContactButton from './components/ContactButton';
import ScrollRestoration from './components/ScrollRestoration';
import AppRoutes from './AppRoutes';

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
  const isLoading = useSelector(selectIsLoading);
  const hideFooterRoutes = ['/login'];
  const showFooter = !hideFooterRoutes.includes(location.pathname);

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(startLoading());
      try {
        await dispatch(refreshSession()).unwrap();
        await dispatch(fetchCurrentUser()).unwrap();
        await dispatch(fetchCart()).unwrap();
      } catch {
        console.log('No hay sesión activa');
      } finally {
        dispatch(stopLoading());
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <>
      <Background />
      <Navbar />
      <ContactButton />
      <AppRoutes />
      <ScrollRestoration />
      {showFooter && <Footer />}
      {isLoading && <LoadingScreen />}
    </>
  );
}

export default App;
