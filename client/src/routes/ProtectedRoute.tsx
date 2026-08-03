import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ isAllowed }: { isAllowed: boolean }) => {
  if (!isAllowed) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
