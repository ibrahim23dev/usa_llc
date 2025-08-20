# ---- Base (pnpm enabled) ----
FROM node:20-slim AS base
ENV NODE_ENV=production
WORKDIR /app
# Enable pnpm via corepack (bundled with Node 20)
RUN corepack enable

# ---- Dependencies (dev deps সহ, build-এর জন্য) ----
FROM base AS deps
ENV NODE_ENV=development
# Cache hits বাড়াতে শুধু manifest + lock কপি
COPY package.json pnpm-lock.yaml ./
# Deterministic install
RUN pnpm install --frozen-lockfile

# ---- Build (TypeScript হলে tsc চালাবে; JS হলে আপনার build স্ক্রিপ্ট) ----
FROM base AS build
ENV NODE_ENV=development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 💡 .env ইমেজে কপি করবেন না; runtime-এ env/pass করুন
RUN pnpm build

# ---- Prune (production deps only) ----
FROM base AS prune
ENV NODE_ENV=production
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules ./node_modules
# devDependencies কেটে দিন
RUN pnpm prune --prod

# ---- Runner (minimal, non-root, no pnpm needed) ----
FROM node:20-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

# Non-root user
RUN groupadd -g 10001 nodejs && useradd -r -u 10001 -g nodejs nodeuser

# শুধুই runtime প্রয়োজনীয় জিনিস কপি করুন
COPY --from=prune /app/node_modules ./node_modules
COPY package.json ./
# আপনার build output (e.g., dist/) কপি করুন
COPY --from=build /app/dist ./dist

# Env (পোর্ট/হোস্ট) — compose/cli দিয়ে override করতে পারেন
ENV PORT=5010
ENV HOST=0.0.0.0

# Express সাধারণত একটাই পোর্টে শোনে
EXPOSE 5010
EXPOSE 5011

# Healthcheck (রুট/পাথ নিজের মতো ঠিক করুন)
# HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
#     CMD node -e "require('http').get(`http://localhost:${process.env.PORT||5050}/health`, r => process.exit(r.statusCode>=200 && r.statusCode<500 ? 0 : 1)).on('error', ()=>process.exit(1))"

# Non-root হিসেবে রান করুন
USER nodeuser

# সরাসরি node দিয়ে সার্ভার চালান (pnpm লাগবে না)
# package.json -> "build": "tsc", আউটপুট: dist/server.js ধরে নেয়া হলো
CMD ["node", "dist/server.js"]
