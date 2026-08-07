import bcrypt from 'bcryptjs';
import db from '@/config/db';
import { AppError } from '@/common/errors/AppError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/common/utils/jwt';
import { generateReferralCode } from '@/modules/referral/referral.utils';
import { RegisterDto, LoginDto } from './auth.types';

export const register = async (dto: RegisterDto) => {
  const existing = await db.user.findUnique({ where: { email: dto.email } });
  if (existing) throw new AppError(400, "User already exists.");

  let referrerId: string | undefined;
  if (dto.referralCode) {
    const referrer = await db.user.findUnique({ where: { referralCode: dto.referralCode } });
    if (!referrer) throw new AppError(400, 'The referral code provided is invalid or has expired.');
    // self-referral is impossible here (user doesn't exist yet) but guard by email match
    if (referrer.email === dto.email) throw new AppError(400, 'You cannot use your own referral code.');
    referrerId = referrer.id;
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);
  const referralCode = await generateReferralCode();

  const user = await db.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        referralCode,
        referredById: referrerId,
      },
    });

    if (referrerId) {
      await tx.referral.create({
        data: { referrerId, referredUserId: newUser.id },
      });
    }

    return newUser;
  });

  const payload = { userId: user.id, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

export const login = async (dto: LoginDto) => {
  const user = await db.user.findUnique({ where: { email: dto.email } });
  if (!user) throw new AppError(401, 'Invalid credentials. Please try again.');

  const valid = await bcrypt.compare(dto.password, user.passwordHash);
  if (!valid) throw new AppError(401, 'Invalid credentials. Please try again.');

  const payload = { userId: user.id, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

export const refresh = async (token: string) => {
  try {
    const payload = verifyRefreshToken(token);
    const user = await db.user.findUnique({ where: { id: payload.userId } });
    if (!user) throw new AppError(401, 'Your session has expired. Please sign in again.');
    return { 
      accessToken: signAccessToken({ userId: user.id, role: user.role }),
      refreshToken: signRefreshToken({ userId: user.id, role: user.role })
    };
  } catch {
    throw new AppError(401, 'Your session has expired. Please sign in again.');
  }
};
