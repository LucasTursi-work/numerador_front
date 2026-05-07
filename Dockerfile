# Etapa 1: Build
FROM node:20-alpine AS builder  
# Alpine reduz a imagem em ~300MB
WORKDIR /app

# 1. Copia e instala dependências de forma determinística
COPY package.json package-lock.json ./
RUN npm ci --quiet && \
    npm install -g @angular/cli@$(grep -oP '"@angular/cli": "\K[^"]+' package.json)

# 2. Copia o código e faz build
COPY . .
#RUN ng build --configuration production 
#--output-path=dist  
# --output-path explícito

# Etapa 2: Servidor web
#FROM nginx:1.25-alpine

# 1. Remove arquivos padrão não usados
#

# 2. Copia apenas os arquivos compilados
#COPY --from=builder /app/dist /usr/share/nginx/html

# 3. Configuração de segurança/performance
#RUN echo "server_tokens off;" > /etc/nginx/conf.d/server_tokens.conf

EXPOSE 4200