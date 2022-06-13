FROM postgres:14-alpine

WORKDIR /

RUN apk add --update vim

COPY postgresql.conf /

COPY set-config.sh /docker-entrypoint-initdb.d/set-config.sh

