import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ isAllowed }: { isAllowed: boolean }) => {
  const location = useLocation();
  if (!isAllowed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
