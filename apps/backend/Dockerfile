FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY apps/backend/package*.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

CMD ["node", "dist/main"]