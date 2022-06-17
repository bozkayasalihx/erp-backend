#!/bin/bash
set -e 

createdb -U "$POSTGRES_USER" test
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname test -f /docker-entrypoint-initdb.d/database.sql