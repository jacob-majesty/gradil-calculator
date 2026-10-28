# syntax=docker/dockerfile:1

FROM node:24-alpine AS server-build
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci && npm cache clean --force
COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build

FROM node:24-alpine AS web-build
WORKDIR /app
COPY web/package.json web/package-lock.json ./
RUN npm ci && npm cache clean --force
COPY web/ ./
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    DB_PATH=/data/gradil.db
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force \
    && mkdir -p /data \
    && chown node:node /data
COPY --from=server-build /app/dist ./dist
COPY --from=web-build /app/dist ./public
USER node
EXPOSE 3000
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/health || exit 1
CMD ["node", "dist/index.js"]
