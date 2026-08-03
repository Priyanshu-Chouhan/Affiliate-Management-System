import { z } from 'zod';
import db from '@/config/db';
import { createCommission } from '@/modules/commission/commission.service';

export const purchaseSchema = z.object({
  amount: z.number().positive(),
  status: z.enum(['success', 'failed', 'cancelled']),
});

export type PurchaseDto = z.infer<typeof purchaseSchema>;

export const createPurchase = async (userId: string, dto: PurchaseDto) => {
  return db.$transaction(async (tx) => {
    const purchase = await tx.purchase.create({
      data: { userId, amount: dto.amount, status: dto.status },
    });

    if (dto.status === 'success') {
      await createCommission(tx, purchase.id, userId, purchase.amount);
    }

    return purchase;
  });
};
