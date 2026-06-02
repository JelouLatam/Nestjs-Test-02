#!/bin/sh
set -eu

host=${DB_HOST:-mysql}
port=${DB_PORT:-3306}

echo "Waiting for database ${host}:${port}..."

i=0
while [ $i -lt 30 ]; do
  if command -v nc >/dev/null 2>&1; then
    if nc -z "$host" "$port" 2>/dev/null; then
      echo "Database is up"
      exec "$@"
    fi
  else
    # Fallback: try to open TCP socket with /dev/tcp if shell supports it
    if (exec 3<> "/dev/tcp/$host/$port") >/dev/null 2>&1; then
      echo "Database is up"
      exec "$@"
    fi
  fi

  i=$((i + 1))
  echo "Waiting... (${i})"
  sleep 1
done

echo "Timed out waiting for database" >&2
exit 1
