import db from '@/config/db';
import { AppError } from '@/common/errors/AppError';
import { getReferrals } from '@/modules/referral/referral.service';
import { getCommissions } from '@/modules/commission/commission.service';

export const getReferralLink = async (userId: string) => {
  const user = await db.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
  if (!user) throw new AppError(404, 'User not found');
  return {
    code: user.referralCode,
    link: `${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/register?ref=${user.referralCode}`,
  };
};

export const getDashboard = async (userId: string) => {
  const [totalReferrals, commissions, payouts] = await Promise.all([
    db.referral.count({ where: { referrerId: userId } }),
    db.commission.findMany({ where: { affiliateId: userId }, select: { amount: true, status: true } }),
    db.payoutRequest.findMany({
      where: { affiliateId: userId, status: { in: ['pending', 'paid'] } },
      select: { amount: true, status: true },
    }),
  ]);

  const sum = (items: { amount: { toNumber(): number } }[]) =>
    items.reduce((acc, c) => acc + c.amount.toNumber(), 0);

  const approved = commissions.filter((c) => c.status === 'approved');
  const paid = commissions.filter((c) => c.status === 'paid');
  const pending = commissions.filter((c) => c.status === 'pending');

  const totalApproved = sum(approved);
  const totalPaid = sum(paid);
  const pendingPayouts = sum(payouts.filter((p) => p.status === 'pending'));

  return {
    totalReferrals,
    totalEarnings: totalApproved + totalPaid,
    availableBalance: totalApproved - pendingPayouts,
    pendingCommissions: sum(pending),
    approvedCommissions: totalApproved,
    paidCommissions: totalPaid,
  };
};

export { getReferrals, getCommissions };
