FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY prisma ./prisma
COPY packages ./packages
COPY packages/proto ./packages/

COPY apps/users/package.json ./apps/users/package.json

RUN npm ci --ignore-scripts

COPY . .

RUN npx prisma generate

RUN rm -rf .turbo
RUN npx turbo run build --filter=users

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/users/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/packages/proto /app/dist/packages/proto

RUN npx prisma generate

ENV NODE_ENV=production

CMD ["node", "/app/dist/apps/users/src/main.js"]