import { z } from 'zod';
import db from '@/config/db';
import { AppError } from '@/common/errors/AppError';
import { DEFAULT_MIN_PAYOUT } from '@/common/constants';

export const payoutSchema = z.object({ amount: z.number().positive() });
export type PayoutDto = z.infer<typeof payoutSchema>;

export const requestPayout = async (affiliateId: string, dto: PayoutDto) => {
  const [commissions, pendingPayoutRequests, minSetting] = await Promise.all([
    db.commission.findMany({
      where: { affiliateId, status: 'approved' },
      select: { amount: true },
    }),
    db.payoutRequest.findMany({
      where: { affiliateId, status: 'pending' },
      select: { amount: true },
    }),
    db.setting.findUnique({ where: { key: 'min_payout_amount' } }),
  ]);

  const minPayout = minSetting ? parseFloat(minSetting.value) : DEFAULT_MIN_PAYOUT;
  if (dto.amount < minPayout) throw new AppError(400, `Minimum payout is ${minPayout}`);

  const sum = (items: { amount: { toNumber(): number } }[]) =>
    items.reduce((acc, p) => acc + p.amount.toNumber(), 0);

  const available = sum(commissions) - sum(pendingPayoutRequests);

  if (dto.amount > available) throw new AppError(400, 'Insufficient balance');

  const existing = await db.payoutRequest.findFirst({ where: { affiliateId, status: 'pending' } });
  if (existing) throw new AppError(409, 'Payout request already pending');

  return db.payoutRequest.create({ data: { affiliateId, amount: dto.amount } });
};

export const getPayoutHistory = async (affiliateId: string) =>
  db.payoutRequest.findMany({
    where: { affiliateId },
    orderBy: { requestedAt: 'desc' },
  });
