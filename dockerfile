# ---------- Etapa 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos package.json primero (mejora caché)
COPY package*.json ./

# Instala TODAS las dependencias (incluye dev para compilar TS)
RUN npm install

# Copia el resto del proyecto
COPY . .

# Compila TypeScript
RUN npm run build


# ---------- Etapa 2: Producción ----------
FROM node:20-alpine

WORKDIR /app

# Copiamos solo lo necesario
COPY package*.json ./

# Instala SOLO dependencias de producción
RUN npm install --omit=dev

# Copiamos el build desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Variables de entorno (opcional)
ENV NODE_ENV=production

# Puerto (ajústalo si usas otro)
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/server.js"]