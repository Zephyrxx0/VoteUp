FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /usr/src/app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build --filter=web

FROM base AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /usr/src/app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/web/server.js"]
