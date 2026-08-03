import db from '@/config/db';
import { AppError } from '@/common/errors/AppError';
import { parsePagination, paginatedResponse } from '@/common/utils/pagination';

export const getAffiliates = async (query: Record<string, unknown>) => {
  const { skip, take, page, limit } = parsePagination(query);
  const search = String(query.search ?? '');

  const where = search
    ? { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { email: { contains: search, mode: 'insensitive' as const } }] }
    : {};

  const [affiliates, total] = await Promise.all([
    db.user.findMany({
      where,
      skip,
      take,
      select: { id: true, name: true, email: true, role: true, referralCode: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.user.count({ where }),
  ]);

  return paginatedResponse(affiliates, total, page, limit);
};

export const getAffiliate = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, role: true, referralCode: true, createdAt: true,
      referralsGiven: { include: { referredUser: { select: { id: true, name: true, email: true } } } },
      commissions: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });
  if (!user) throw new AppError(404, 'Affiliate not found');
  return user;
};

export const getPayouts = async (status?: string) => {
  const where = status ? { status: status as 'pending' | 'approved' | 'rejected' | 'paid' } : {};
  return db.payoutRequest.findMany({
    where,
    orderBy: { requestedAt: 'desc' },
    include: { affiliate: { select: { id: true, name: true, email: true } } },
  });
};

export const approvePayout = async (id: string) => {
  const payout = await db.payoutRequest.findUnique({ where: { id } });
  if (!payout) throw new AppError(404, 'Payout not found');
  if (payout.status !== 'pending') throw new AppError(400, 'Payout is not pending');
  return db.payoutRequest.update({ where: { id }, data: { status: 'approved', processedAt: new Date() } });
};

export const rejectPayout = async (id: string) => {
  const payout = await db.payoutRequest.findUnique({ where: { id } });
  if (!payout) throw new AppError(404, 'Payout not found');
  if (payout.status !== 'pending') throw new AppError(400, 'Payout is not pending');
  return db.payoutRequest.update({ where: { id }, data: { status: 'rejected', processedAt: new Date() } });
};

export const getCommissions = async () =>
  db.commission.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      affiliate: { select: { id: true, name: true, email: true } },
      purchase: { select: { amount: true, createdAt: true } },
    },
  });

export const getStats = async () => {
  const [totalUsers, totalReferrals, commissions, payouts] = await Promise.all([
    db.user.count(),
    db.referral.count(),
    db.commission.findMany({ select: { amount: true, status: true } }),
    db.payoutRequest.findMany({ select: { amount: true, status: true } }),
  ]);

  const sum = (items: { amount: { toNumber(): number } }[]) =>
    items.reduce((acc, c) => acc + c.amount.toNumber(), 0);

  return {
    totalUsers,
    totalReferrals,
    totalCommissionsIssued: sum(commissions),
    totalPayoutsProcessed: sum(payouts.filter((p) => p.status === 'paid')),
    pendingPayouts: sum(payouts.filter((p) => p.status === 'pending')),
  };
};

export const getTopAffiliates = async () => {
  const commissions = await db.commission.groupBy({
    by: ['affiliateId'],
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: 10,
  });

  const ids = commissions.map((c) => c.affiliateId);
  const users = await db.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, email: true },
  });

  return commissions.map((c) => ({
    affiliate: users.find((u) => u.id === c.affiliateId),
    totalEarnings: c._sum.amount?.toNumber() ?? 0,
  }));
};
