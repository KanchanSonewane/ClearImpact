# Multi-stage build for ClearImpact Production Container
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and package definitions
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install --prefix server
RUN npm install --prefix client

# Copy application source code
COPY . .

# Build the client production bundle
RUN npm run build --prefix client

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Copy root, built client, and server
COPY package*.json ./
COPY server ./server
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/node_modules ./server/node_modules

EXPOSE 5000

CMD ["node", "server/server.js"]
