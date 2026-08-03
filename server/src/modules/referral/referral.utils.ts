import db from '@/config/db';

const randomCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export const generateReferralCode = async (): Promise<string> => {
  let code = randomCode();
  while (await db.user.findUnique({ where: { referralCode: code } })) {
    code = randomCode();
  }
  return code;
};
