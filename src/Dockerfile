# Etapa 1: Builder
FROM node:18 AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários
COPY package*.json ./
RUN npx ng build --configuration production

# Copia o restante do projeto
COPY . .

# Compila a aplicação Angular
RUN ng build --configuration production

# Etapa 2: Servidor nginx (ou outro)
FROM nginx:alpine

# Copia os arquivos compilados do builder para o nginx
COPY --from=builder /app/dist/nome-do-seu-projeto /usr/share/nginx/html

# Exponha a porta (caso use nginx)
EXPOSE 80