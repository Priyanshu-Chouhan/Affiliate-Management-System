import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { ReferralHistoryPage } from '@/pages/dashboard/ReferralHistoryPage';
import { CommissionHistoryPage } from '@/pages/dashboard/CommissionHistoryPage';
import { PayoutPage } from '@/pages/dashboard/PayoutPage';
import { AdminPage } from '@/pages/admin/AdminPage';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export const AppRoutes = () => {
  const { token, user } = useAuth();
  const isAuth = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuth ? '/dashboard' : '/login'} replace />} />
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
