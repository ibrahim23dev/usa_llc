# Pilgrimage Management API

A modern Node.js backend using Express, TypeScript, Prisma, and PostgreSQL.

## Setup
1. `pnpm install`
2. Set up .env with DATABASE_URL
3. `npx prisma migrate dev --name init`
4. `pnpm dev`

## Endpoints
- POST /api/bookings: Create booking
- GET /api/bookings/:id: Get booking

Expand with more features as needed.