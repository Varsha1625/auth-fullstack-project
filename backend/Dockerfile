# Use Node LTS
FROM node:18-alpine

WORKDIR /app

# Install dependencies (production)
COPY package*.json ./
RUN npm ci --production

# Copy source & build (for NestJS we need build step)
COPY . .

# If your repo uses TypeScript build step:
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
