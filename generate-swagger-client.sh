#!/bin/bash

DIRECTORY="frontend/generated-api"

# Check if the directory exists
if [ -d "$DIRECTORY" ]; then
  echo "Deleting directory: $DIRECTORY"
  rm -rf "$DIRECTORY"
fi
echo "Making directory: "$DIRECTORY""
mkdir -p "$DIRECTORY"

docker run --rm \
  -v $(pwd):/local \
  swaggerapi/swagger-codegen-cli-v3 generate \
  -i http://host.docker.internal:3000/swagger.json \
  -l typescript-fetch \
  -o /local/frontend/generated-api
