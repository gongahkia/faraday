FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY models/embedding/ ./models/embedding/

EXPOSE 8001

CMD ["uvicorn", "backend.api.documents:app", "--host", "0.0.0.0", "--port", "8001"]