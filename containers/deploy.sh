#! /bin/bash

SHA=$(git rev-parse HEAD)

docker build -f ./containers/Dockerfile -t naticadevelopment/prod_server:latest . 
docker build -f ./containers/Dockerfile.prod.postgres -t naticadevelopment/prod_db . 

docker push naticadevelopment/prod_db
docker push naticadevelopment/prod_server

