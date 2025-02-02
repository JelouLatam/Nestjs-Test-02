# ------------- Fase 1: Builder -------------
FROM node:18 AS builder

# Crear directorio de trabajo
WORKDIR /app
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Resto
COPY . .

# se compila NestJS
RUN npm run build


# ------------- Fase 2: Runner -------------
FROM node:18 AS runner

WORKDIR /app

# Se instala lo necesario
COPY package*.json ./
RUN npm install --production

# Carpeta dist compilada
COPY --from=builder /app/dist ./dist

# Puerto
EXPOSE 3000

# Arrancar el app
CMD ["node", "dist/main.js"]
