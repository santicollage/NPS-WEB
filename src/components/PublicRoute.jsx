import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../store/slices/userSelectors';

const PublicRoute = ({ children, redirectTo = '/' }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute;
