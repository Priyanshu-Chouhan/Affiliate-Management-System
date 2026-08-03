# Affiliate Management System

Full-stack affiliate management platform — React + TypeScript frontend, Node/Express + TypeScript backend, PostgreSQL via Prisma.

## Project Structure

```
client/   — React + Vite + TypeScript frontend
server/   — Express + TypeScript backend
```

## Quick Start

### 1. Database
Create a PostgreSQL database named `affiliate_db` (or update `DATABASE_URL` in `server/.env`).

### 2. Backend

```bash
cd server
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed        # seeds demo users, referrals, commissions
npm run dev            # starts on http://localhost:4000
```

### 3. Frontend

```bash
cd client
npm install
npm run dev            # starts on http://localhost:5173
```

## Demo Accounts (after seed)

| Email | Password | Role |
|---|---|---|
| admin@example.com | admin123 | admin |
| alice@example.com | password123 | affiliate (has referrals) |
| bob@example.com | password123 | affiliate |

## Environment Variables

### server/.env
```
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/affiliate_db?schema=public"
JWT_ACCESS_SECRET="change-me-access-secret"
JWT_REFRESH_SECRET="change-me-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
```

### client/.env (optional)
```
VITE_API_BASE_URL=http://localhost:4000/api
```

## API Endpoints

### Auth
- `POST /api/auth/register` — `{ name, email, password, referralCode? }`
- `POST /api/auth/login` — `{ email, password }`
- `POST /api/auth/refresh` — `{ refreshToken }`

### Affiliate (JWT required)
- `GET /api/affiliate/referral-link`
- `GET /api/affiliate/dashboard`
- `GET /api/affiliate/referrals?page=&search=`
- `GET /api/affiliate/commissions?page=&status=`
- `POST /api/affiliate/payout` — `{ amount }`
- `GET /api/affiliate/payout/history`

### Admin (JWT + admin role)
- `GET /api/admin/affiliates?page=&search=`
- `GET /api/admin/affiliates/:id`
- `GET /api/admin/payouts?status=`
- `PATCH /api/admin/payouts/:id/approve`
- `PATCH /api/admin/payouts/:id/reject`
- `GET /api/admin/commissions`
- `GET /api/admin/stats`
- `GET /api/admin/top-affiliates`

### Purchase (JWT required)
- `POST /api/purchases` — `{ amount, status: "success"|"failed"|"cancelled" }`
