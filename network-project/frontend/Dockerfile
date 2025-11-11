# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos de manifesto do pacote e instale as dependências
COPY package*.json ./
RUN npm install

# Copie o restante do código-fonte
COPY . .

# Compile o Next.js
RUN npm run build

# Exponha a porta em que o frontend é executado
EXPOSE 3000

# Defina o comando para iniciar a aplicação
CMD ["npm", "start"]
