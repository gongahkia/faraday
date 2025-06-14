#!/bin/bash

MODEL_DIR="./models/language"
REPO_ID="TheBloke/Mistral-7B-Instruct-v0.2-GGUF"
FILE_NAME="mistral-7b-instruct-v0.2.Q4_K_M.gguf"

echo "Downloading language models..."
python -c "
from huggingface_hub import hf_hub_download
hf_hub_download(
    repo_id='${REPO_ID}',
    filename='${FILE_NAME}',
    local_dir='${MODEL_DIR}',
    local_dir_use_symlinks=False
)
"
echo "Model download complete. Updating config..."
echo '{"last_updated": "'$(date +%Y-%m-%d)'"}' > "${MODEL_DIR}/.version"