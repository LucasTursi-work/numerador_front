# Etapa 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Copia apenas arquivos de dependências (otimiza cache de camadas)
COPY package*.json ./

# 2. Instala as dependências (npm ci é mais rápido e limpo para CI/CD)
RUN npm ci

# 3. Copia todo o código fonte
COPY . .

# 4. Compila a aplicação (usando o script do package.json)
RUN npm run build -- --configuration production

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# 5. Ajuste o caminho de origem: Angular 18 coloca os arquivos em /browser/
# Substitua 'nome-do-seu-projeto' pelo "name" que está no seu package.json
COPY --from=builder /app/dist/nome-do-seu-projeto/browser /usr/share/nginx/html

# 6. Copia uma configuração customizada do Nginx (Essencial para Angular)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]