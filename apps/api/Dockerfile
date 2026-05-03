FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN pnpm install --frozen-lockfile
RUN pnpm run build --filter=api

FROM base AS runner
WORKDIR /usr/src/app
# We need the app and its workspace dependencies
# pnpm deploy is still the best for API if it works, but let's try a simple copy if needed.
# For now, let's keep the simple pattern but make sure it starts.
COPY --from=build /usr/src/app ./

EXPOSE 3001
ENV PORT 3001
CMD [ "pnpm", "start", "--filter=api" ]
