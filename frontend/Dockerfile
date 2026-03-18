# Dockerfile pour le frontend React
FROM node:18-alpine as builder

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./
RUN npm ci --only=production

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

# Stage de production
FROM nginx:alpine

# Copier le build
COPY --from=builder /app/build /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
