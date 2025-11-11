# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos de manifesto do pacote e instale as dependências
COPY package*.json ./
RUN npm install

# Copie o schema do Prisma
COPY prisma ./prisma/

# Gere o cliente Prisma
RUN npx prisma generate

# Copie o restante do código-fonte
COPY . .

# Compile o TypeScript
RUN npm run build

# Exponha a porta em que o backend é executado
EXPOSE 3001

# Defina o comando para iniciar a aplicação
CMD ["npm", "start"]