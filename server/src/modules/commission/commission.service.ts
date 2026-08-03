import { Prisma } from '@prisma/client';
import db from '@/config/db';
import { DEFAULT_COMMISSION_RATE } from '@/common/constants';
import { parsePagination, paginatedResponse } from '@/common/utils/pagination';
import { CommissionStatusFilter } from './commission.types';

export const createCommission = async (
  tx: Prisma.TransactionClient,
  purchaseId: string,
  buyerId: string,
  purchaseAmount: Prisma.Decimal,
) => {
  const referral = await tx.referral.findFirst({ where: { referredUserId: buyerId } });
  if (!referral) return null;

  const rateSetting = await tx.setting.findUnique({ where: { key: 'commission_rate' } });
  const rate = rateSetting ? parseFloat(rateSetting.value) : DEFAULT_COMMISSION_RATE;
  const commissionAmount = new Prisma.Decimal(purchaseAmount.toNumber() * rate);

  const commission = await tx.commission.create({
    data: {
      affiliateId: referral.referrerId,
      referralId: referral.id,
      purchaseId,
      amount: commissionAmount,
      description: `Commission for purchase ${purchaseId}`,
    },
  });

  await tx.referral.update({ where: { id: referral.id }, data: { status: 'purchased' } });

  return commission;
};

export const getCommissions = async (affiliateId: string, query: Record<string, unknown>) => {
  const { skip, take, page, limit } = parsePagination(query);
  const status = query.status as CommissionStatusFilter | undefined;

  const where = {
    affiliateId,
    ...(status && { status }),
  };

  const [commissions, total] = await Promise.all([
    db.commission.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { purchase: { select: { amount: true, createdAt: true } } },
    }),
    db.commission.count({ where }),
  ]);

  return paginatedResponse(commissions, total, page, limit);
};
