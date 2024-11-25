#!/bin/bash
set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 3306; do
  echo "Esperando a que MySQL esté listo en $host:3306..."
  sleep 2
done

exec $cmd
