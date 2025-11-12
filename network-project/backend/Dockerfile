FROM node:20-bullseye-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libc6-dev \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/server.js"]
