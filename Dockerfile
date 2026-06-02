# Etapa de construcción para desarrollo y producción
FROM node:20.11.1-alpine AS builder

WORKDIR /usr/src/app

# Copiar archivos de dependencias primero para mejor caching
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar dependencias (incluyendo dev para builder)
RUN npm ci --include=dev && npm cache clean --force

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM node:20.11.1-alpine AS production

WORKDIR /usr/src/app

# Instalar dependencias de sistema necesarias
RUN apk add --no-cache openssl

# Crear usuario no root para seguridad
RUN addgroup -g 1001 -S app && \
    adduser -u 1001 -S app -G app

# Copiar dependencias y build desde builder
COPY --from=builder --chown=app:app /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=app:app /usr/src/app/dist ./dist
COPY --from=builder --chown=app:app /usr/src/app/package*.json ./

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Exponer puerto
EXPOSE 3000

# Cambiar a usuario no root
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/healthcheck.js || exit 1

# Comando de inicio
CMD ["node", "dist/main.js"]

# Etapa de desarrollo
FROM node:20.11.1-alpine AS development

WORKDIR /usr/src/app

# Instalar dependencias de sistema
# add bash and netcat so our scripts can run reliably in the container
RUN apk add --no-cache openssl bash netcat-openbsd

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando de desarrollo con hot reload
# Use sh -c wrapper so our wait-for-db script can be executed in the entry command
CMD ["/bin/sh", "-c", "./scripts/wait-for-db.sh npm run start:dev -- --preserveWatchOutput"]