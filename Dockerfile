# Stage 1: Build
FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Production
FROM node:18-slim
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["node", "server.js"]
