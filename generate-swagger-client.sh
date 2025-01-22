#!/bin/bash

FRONTEND_DIRECTORY="frontend/generated-api"
BACKEND_DIRECTORY="backend/src/generated-api"

# Check if the front end directory exists
if [ -d "$FRONTEND_DIRECTORY" ]; then
  echo "Deleting directory: $FRONTEND_DIRECTORY"
  rm -rf "$FRONTEND_DIRECTORY"
fi
echo "Making directory: "$FRONTEND_DIRECTORY""
mkdir -p "$FRONTEND_DIRECTORY"

# Check if the back end directory exists
if [ -d "$BACKEND_DIRECTORY" ]; then
  echo "Deleting directory: $BACKEND_DIRECTORY"
  rm -rf "$BACKEND_DIRECTORY"
fi
echo "Making directory: "$BACKEND_DIRECTORY""
mkdir -p "$BACKEND_DIRECTORY"


#Generate front end client api code (models and api)
docker run --rm \
  -v ${PWD}:/local \
  swaggerapi/swagger-codegen-cli-v3 generate \
  -i /local/backend/docs/api-doc.yaml \
  -l typescript-axios \
  -o /local/frontend/generated-api

#Generate back end api code (models only)
docker run --rm \
  -v ${PWD}:/local \
  swaggerapi/swagger-codegen-cli-v3 generate \
  -i /local/backend/docs/api-doc.yaml \
  -l typescript-axios \
  -c /local/swagger-codegen-config-backend.json \
  -o /local/$BACKEND_DIRECTORY \

# Keep only specific files/directories in backend
cd $BACKEND_DIRECTORY

# Files and directories to keep
keep_files=(
    ".swagger-codegen"
    "models"
    ".gitignore"
    # ".npmignore"
    # ".swagger-codegen-ignore"
    "index.ts"
    # "package.json"
    # "README.md"
    # "tsconfig.json"
)

# Delete everything except items in keep_files
for file in *; do
    if [[ ! " ${keep_files[@]} " =~ " ${file} " ]]; then
        rm -rf "$file"
    fi
done

# Modify index.ts to only export models
sed -i '' \
    -e '/export \* from "\.\/api";/d' \
    -e '/export \* from "\.\/configuration";/d' \
    "./index.ts"


echo "Generated files in $FRONTEND_DIRECTORY:"
ls -l $FRONTEND_DIRECTORY

echo "Generated files in $BACKEND_DIRECTORY:"
ls -l $BACKEND_DIRECTORY