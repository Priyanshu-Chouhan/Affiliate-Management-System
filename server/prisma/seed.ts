import { PrismaClient } from '@prisma/client';
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
  await prisma.user.upsert({
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

  console.log('Seed complete.');
  console.log('  admin@example.com / admin123  (role: admin)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
