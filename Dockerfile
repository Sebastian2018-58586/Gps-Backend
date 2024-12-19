# Usa una imagen oficial de Node.js como base
FROM node:18-slim

# Establecer la variable de entorno para la producción
ENV NODE_ENV=production

# Crear y establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json (si existe) e instalar dependencias
COPY package*.json ./
RUN npm install

# Instalar sequelize-cli globalmente
RUN npm install -g sequelize-cli

# Instalar netcat-openbsd (nc) para usarlo en el script wait-for-it.sh
RUN apt-get update && apt-get install -y netcat-openbsd

# Copiar el resto del código fuente al contenedor
COPY . .

# Copiar el script wait-for-it.sh
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Exponer el puerto en el que la aplicación se ejecuta
EXPOSE 3000

# Comando para iniciar la aplicación con espera
CMD ["bash", "/usr/local/bin/wait-for-it.sh", "db", "--", "npm", "start"]