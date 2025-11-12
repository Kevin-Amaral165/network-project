# Dockerfile do backend
FROM node:20-bullseye-slim

# Instala dependências do sistema necessárias para Prisma e bcrypt
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libc6-dev \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Configura diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências Node.js
RUN npm install

# Copia todo o código da aplicação
COPY . .

# Gera Prisma Client
RUN npx prisma generate

# Compila TypeScript para JavaScript
RUN npm run build

# Expõe porta do backend
EXPOSE 3001

# Comando padrão para iniciar a aplicação compilada
CMD ["node", "dist/server.js"]
