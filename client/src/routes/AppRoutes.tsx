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
import { NotFoundPage } from './NotFoundPage';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export const AppRoutes = () => {
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const isAuth = !!accessToken;
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={isAuth ? '/dashboard' : '/login'} replace />
        }
      />
      <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/admin/login" element={isAuth && isAdmin ? <Navigate to="/admin" replace /> : <LoginPage isAdmin />} />
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

      {/* 404 Page Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
