# Affiliate Management System

Full-stack affiliate management platform — React + TypeScript frontend, Node/Express + TypeScript backend, PostgreSQL via Prisma.

## Live Links
- **Frontend App**: [https://affiliate-frontend-bk5i.onrender.com](https://affiliate-frontend-bk5i.onrender.com)
- **Backend API**: [https://affiliate-backend.onrender.com](https://affiliate-backend.onrender.com)
*(Note: Replace backend link with the actual live backend URL if different)*

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Redux Toolkit, RTK Query, React Hook Form, Zod, TailwindCSS |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL |
| **Auth** | JWT (Access + Refresh Token Rotation) |
| **Security** | Helmet, CORS Whitelist, Rate Limiting, Zod Validation |
| **CI/CD** | GitHub Actions |

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
- `GET /api/affiliate/referrals?page=&search=&sortBy=createdAt&sortOrder=desc`
- `GET /api/affiliate/commissions?page=&status=&sortBy=createdAt&sortOrder=desc`
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

> **Note**: A complete Postman collection is available in the root directory (`postman_collection.json`). You can import this file directly into Postman to test all available API endpoints.

## Security

- **Helmet** — Sets secure HTTP headers (X-Content-Type, X-Frame-Options, etc.)
- **CORS Whitelist** — Only allowed frontend origins can access the API
- **Rate Limiting** — Global: 100 req/15min, Auth: 20 req/15min per IP
- **Body Size Limit** — JSON payloads capped at 1MB
- **JWT Refresh Token Rotation** — New refresh token on every refresh call
- **Zod Validation** — All inputs validated on both client and server
- **Password Hashing** — bcrypt with salt rounds of 10
- **Role-Based Access** — Admin routes protected by role middleware
