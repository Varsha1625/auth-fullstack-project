FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# copy build output and package.json (only runtime deps)
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
RUN npm ci --production

EXPOSE 5173

CMD ["node", "build/index.js"]
