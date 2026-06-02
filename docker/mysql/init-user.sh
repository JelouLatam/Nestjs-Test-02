#!/bin/bash
set -e

# This script runs inside the official MySQL container initialization phase.
# It creates the application database (if missing) and an app user with
# privileges. It uses the environment variables provided to the container:
# - MYSQL_DATABASE (set by docker-compose)
# - MYSQL_ROOT_PASSWORD (set by docker-compose)
# - APP_DB_USER (passed from compose env)
# - APP_DB_PASSWORD (passed from compose env)

if [ -z "$MYSQL_ROOT_PASSWORD" ]; then
  echo "MYSQL_ROOT_PASSWORD is not set, cannot configure database. Exiting."
  exit 1
fi

mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
CREATE DATABASE IF NOT EXISTS \`$MYSQL_DATABASE\`;
CREATE USER IF NOT EXISTS '${APP_DB_USER}'@'%' IDENTIFIED BY '${APP_DB_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${APP_DB_USER}'@'%';
FLUSH PRIVILEGES;
EOSQL

echo "Database ${MYSQL_DATABASE} and user ${APP_DB_USER} ensured."
