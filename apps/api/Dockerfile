# -----------------------------------------------------------------------------
# Multi-stage Dockerfile for NabungID Express Backend API
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations and package definitions
COPY package*.json turbo.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/tsconfig/package*.json ./packages/tsconfig/
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm ci

# Copy source codes
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Generate Prisma Client & Build TypeScript
WORKDIR /app/apps/api
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

# -----------------------------------------------------------------------------
# Production Runner Image
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy built artifacts and production dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package*.json ./

EXPOSE 5000

CMD ["node", "dist/server.js"]
