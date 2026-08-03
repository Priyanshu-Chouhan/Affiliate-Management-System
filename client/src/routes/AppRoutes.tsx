import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/features/auth';
import {
  DashboardPage,
  ReferralHistoryPage,
  CommissionHistoryPage,
  PayoutPage,
} from '@/features/affiliate';
import { AdminPage } from '@/features/admin';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '@/hooks';

export const AppRoutes = () => {
  const { token, user } = useAuth();
  const isAuth = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={isAuth ? '/dashboard' : '/login'} replace />
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute isAllowed={isAuth} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/referrals" element={<ReferralHistoryPage />} />
        <Route path="/commissions" element={<CommissionHistoryPage />} />
        <Route path="/payout" element={<PayoutPage />} />
      </Route>

      <Route element={<ProtectedRoute isAllowed={isAuth && isAdmin} />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
