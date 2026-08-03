import { PrismaClient, PurchaseStatus, CommissionStatus, PayoutStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.setting.createMany({
    data: [
      { key: 'commission_rate', value: '0.10' },
      { key: 'min_payout_amount', value: '25' },
    ],
    skipDuplicates: true,
  });

  const adminHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminHash,
      role: 'admin',
      referralCode: 'ADMIN001',
    },
  });

  const affiliateHash = await bcrypt.hash('password123', 10);
  const affiliate1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      passwordHash: affiliateHash,
      referralCode: 'ALICE001',
    },
  });

  const affiliate2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      name: 'Bob Jones',
      email: 'bob@example.com',
      passwordHash: affiliateHash,
      referralCode: 'BOB001',
    },
  });

  const referred1 = await prisma.user.upsert({
    where: { email: 'carol@example.com' },
    update: {},
    create: {
      name: 'Carol White',
      email: 'carol@example.com',
      passwordHash: affiliateHash,
      referralCode: 'CAROL001',
      referredById: affiliate1.id,
    },
  });

  const referred2 = await prisma.user.upsert({
    where: { email: 'dave@example.com' },
    update: {},
    create: {
      name: 'Dave Brown',
      email: 'dave@example.com',
      passwordHash: affiliateHash,
      referralCode: 'DAVE001',
      referredById: affiliate1.id,
    },
  });

  const referred3 = await prisma.user.upsert({
    where: { email: 'eve@example.com' },
    update: {},
    create: {
      name: 'Eve Davis',
      email: 'eve@example.com',
      passwordHash: affiliateHash,
      referralCode: 'EVE001',
      referredById: affiliate2.id,
    },
  });

  const referral1 = await prisma.referral.upsert({
    where: { referredUserId: referred1.id },
    update: {},
    create: { referrerId: affiliate1.id, referredUserId: referred1.id, status: 'purchased' },
  });

  const referral2 = await prisma.referral.upsert({
    where: { referredUserId: referred2.id },
    update: {},
    create: { referrerId: affiliate1.id, referredUserId: referred2.id, status: 'purchased' },
  });

  const referral3 = await prisma.referral.upsert({
    where: { referredUserId: referred3.id },
    update: {},
    create: { referrerId: affiliate2.id, referredUserId: referred3.id, status: 'pending' },
  });

  const purchase1 = await prisma.purchase.create({
    data: { userId: referred1.id, amount: 200, status: PurchaseStatus.success },
  });

  const purchase2 = await prisma.purchase.create({
    data: { userId: referred2.id, amount: 150, status: PurchaseStatus.success },
  });

  await prisma.commission.createMany({
    data: [
      {
        affiliateId: affiliate1.id,
        referralId: referral1.id,
        purchaseId: purchase1.id,
        amount: 20,
        status: CommissionStatus.approved,
      },
      {
        affiliateId: affiliate1.id,
        referralId: referral2.id,
        purchaseId: purchase2.id,
        amount: 15,
        status: CommissionStatus.pending,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.payoutRequest.create({
    data: {
      affiliateId: affiliate1.id,
      amount: 20,
      status: PayoutStatus.pending,
    },
  });

  console.log('Seed complete. Demo accounts:');
  console.log('  admin@example.com / admin123  (role: admin)');
  console.log('  alice@example.com / password123  (affiliate with referrals)');
  console.log('  bob@example.com   / password123  (affiliate)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
