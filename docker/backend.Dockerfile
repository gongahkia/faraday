FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-glx \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY models/ ./models/
COPY helper/ ./helper/

EXPOSE 8000

CMD ["uvicorn", "backend.api.chat:app", "--host", "0.0.0.0", "--port", "8000"]