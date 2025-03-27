FROM node:20-alpine
RUN apk add --no-cache procps
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
