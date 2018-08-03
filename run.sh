#!/usr/bin/env bash
source ./env.list
docker run -d -p 1995:5000 --env-file ./env.list --name $CONTAINER_NAME -v $APP:/app speech
sleep 3
docker ps