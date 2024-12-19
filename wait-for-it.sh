#!/bin/bash
set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 3306; do
  echo "Esperando a que MySQL esté listo en $host:3306..."
  sleep 2
done

# Ejecutar las migraciones
echo "Ejecutando migraciones..."
npx sequelize db:migrate

# Ejecutar los seeders
echo "Ejecutando seeders..."
npx sequelize db:seed:all

# Iniciar la aplicación
echo "Iniciando la aplicación..."
exec $cmd