#!/bin/bash

MODEL_DIR="./models/embedding"
MODEL_NAME="all-MiniLM-L6-v2"

echo "Downloading embedding models to ${MODEL_DIR}..."
python -c "
from sentence_transformers import SentenceTransformer
SentenceTransformer('${MODEL_NAME}', cache_folder='${MODEL_DIR}')
"
echo "Model download complete. Updating config..."
echo '{"default_model": "'${MODEL_NAME}'"}' > "${MODEL_DIR}/.version"