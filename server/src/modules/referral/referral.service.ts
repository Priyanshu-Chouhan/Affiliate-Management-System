import db from '@/config/db';
import { parsePagination, paginatedResponse } from '@/common/utils/pagination';

type SortOrder = 'asc' | 'desc';

export const getReferrals = async (affiliateId: string, query: Record<string, unknown>) => {
  const { skip, take, page, limit } = parsePagination(query);
  const search = String(query.search ?? '');
  const sortBy = String(query.sortBy ?? 'createdAt');
  const sortOrder = (String(query.sortOrder ?? 'desc')) as SortOrder;

  const allowedSortFields = ['createdAt', 'status'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

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
      orderBy: { [safeSortBy]: sortOrder },
      include: {
        referredUser: { select: { id: true, name: true, email: true } },
        commissions: { select: { amount: true, status: true }, take: 1 },
      },
    }),
    db.referral.count({ where }),
  ]);

  const mapped = referrals.map((r) => ({
    ...r,
    commissionEarned: r.commissions[0]?.amount?.toNumber() ?? 0,
    commissionStatus: r.commissions[0]?.status ?? null,
    commissions: undefined,
  }));

  return paginatedResponse(mapped, total, page, limit);
};
