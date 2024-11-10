# Usa una imagen oficial de Node.js como base
FROM node:18

# Establecer la variable de entorno para la producción
ENV NODE_ENV=production

# Crear y establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json (si existe) e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente al contenedor
COPY . .

# Exponer el puerto en el que la aplicación se ejecuta
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
