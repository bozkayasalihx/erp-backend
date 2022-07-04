#! /bin/sh

SHA=$(git rev-parse HEAD)

docker build -f ./containers/Dockerfile -t naticadevelopment/prod_server:latest -t naticadevelopment/prod_server:$SHA . 
docker build -f ./containers/Dockerfile.prod.postgres -t naticadevelopment/prod_db:latest -t naticadevelopment/prod_db:$SHA . 

docker push naticadevelopment/prod_db
docker push naticadevelopment/prod_server

