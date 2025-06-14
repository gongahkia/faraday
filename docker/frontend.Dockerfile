FROM node:18-alpine

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --production

COPY frontend/ ./frontend/

RUN npm run build --prefix frontend

EXPOSE 19000

CMD ["npm", "start", "--prefix", "frontend"]