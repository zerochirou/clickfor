# Multi-stage Dockerfile for NestJS (server) in a Turborepo / pnpm monorepo
# Base image: Node.js 22 on Alpine Linux
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN apk add --no-cache libc6-compat openssl

# ------------------------------------------------------------------------------
# Stage 1: Pruner
# Uses Turborepo to prune the monorepo down only to what's needed by `server`
# ------------------------------------------------------------------------------
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@^2.10.8
COPY . .
RUN turbo prune server --docker

# ------------------------------------------------------------------------------
# Stage 2: Builder
# Installs dependencies, generates Prisma client, and compiles the NestJS app
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# First copy lockfile & pruned package manifests to leverage Docker cache
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Copy full source code from pruned output
COPY --from=pruner /app/out/full/ .

# Generate Prisma client for the server
RUN pnpm --filter server db:generate

# Build NestJS production bundle
RUN pnpm --filter server build

# Prune devDependencies to keep the production layer slim
RUN pnpm install --prod --ignore-scripts

# ------------------------------------------------------------------------------
# Stage 3: Runner (Production Image)
# Minimal runtime environment running as a non-root user
# ------------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Create a dedicated non-root group and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy root manifests & pruned node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Copy server package files, generated Prisma client & schema
COPY --from=builder --chown=nestjs:nodejs /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder --chown=nestjs:nodejs /app/apps/server/prisma ./apps/server/prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/server/prisma.config.ts ./apps/server/prisma.config.ts
COPY --from=builder --chown=nestjs:nodejs /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/server/dist ./apps/server/dist

USER nestjs

EXPOSE 4000

WORKDIR /app/apps/server

CMD ["node", "dist/main.js"]
