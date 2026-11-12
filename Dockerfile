# Stage 1: Build static frontend assets
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY server.js ./
COPY src/data/seo-pages.json ./src/data/seo-pages.json

EXPOSE 8080

# Run as the unprivileged user that ships with the image, not root.
USER node

CMD ["node", "server.js"]
