# Multi-stage Dockerfile for Next.js (app) in a Turborepo / pnpm monorepo
# Base image: Node.js 22 on Alpine Linux
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
RUN apk add --no-cache libc6-compat

# ------------------------------------------------------------------------------
# Stage 1: Pruner
# Uses Turborepo to prune the monorepo down only to what's needed by `app`
# ------------------------------------------------------------------------------
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@^2.10.8
COPY . .
RUN turbo prune app --docker

# ------------------------------------------------------------------------------
# Stage 2: Builder
# Installs dependencies and builds the standalone Next.js application
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Arguments for Next.js build-time public variables
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SERVER_API
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_S3_PRODUCT_BUCKET

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_SERVER_API=$NEXT_PUBLIC_SERVER_API
ENV NEXT_PUBLIC_AUTH_URL=$NEXT_PUBLIC_AUTH_URL
ENV NEXT_PUBLIC_S3_PRODUCT_BUCKET=$NEXT_PUBLIC_S3_PRODUCT_BUCKET
ENV NEXT_TELEMETRY_DISABLED=1

# First copy lockfile & pruned package manifests to leverage Docker cache
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Copy full source code from pruned output
COPY --from=pruner /app/out/full/ .

# Build Next.js application with standalone output
RUN pnpm --filter app build

# ------------------------------------------------------------------------------
# Stage 3: Runner (Production Image)
# Minimal runtime environment running as a non-root user
# ------------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root group and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public static assets
COPY --from=builder /app/apps/app/public ./apps/app/public

# Set correct permission for prerender cache
RUN mkdir -p ./apps/app/.next && chown nextjs:nodejs ./apps/app/.next

# Copy standalone output and static files
COPY --from=builder --chown=nextjs:nodejs /app/apps/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/app/.next/static ./apps/app/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/app/server.js"]
