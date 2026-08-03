import db from '@/config/db';
import { parsePagination, paginatedResponse } from '@/common/utils/pagination';

export const getReferrals = async (affiliateId: string, query: Record<string, unknown>) => {
  const { skip, take, page, limit } = parsePagination(query);
  const search = String(query.search ?? '');

  const where = {
    referrerId: affiliateId,
    ...(search && {
      referredUser: { name: { contains: search, mode: 'insensitive' as const } },
    }),
  };

  const [referrals, total] = await Promise.all([
    db.referral.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { referredUser: { select: { id: true, name: true, email: true } } },
    }),
    db.referral.count({ where }),
  ]);

  return paginatedResponse(referrals, total, page, limit);
};
