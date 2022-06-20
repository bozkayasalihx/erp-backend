FROM postgres:14-alpine

WORKDIR /

RUN apk add --update vim

COPY ./postgresql.conf /postgresql.conf

COPY ./set-config.sh /docker-entrypoint-initdb.d/

COPY ./src/seeds/restore_db.sh /docker-entrypoint-initdb.d/

COPY ./src/seeds/database.sql /docker-entrypoint-initdb.d/

WORKDIR /var/lib/postgresql/data/pgdata