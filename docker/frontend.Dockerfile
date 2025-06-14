FROM node:18-alpine

WORKDIR /app

COPY frontend/package*.json ./

# Install dependencies
RUN npm install --production

COPY frontend/ ./

EXPOSE 19000

CMD ["npm", "run", "build"]