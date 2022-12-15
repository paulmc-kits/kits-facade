FROM node:18-alpine

WORKDIR /src

COPY app/package*.json .
RUN npm install

COPY app/ .
RUN npm run build:sass && npm run build:server

CMD ["npm", "start"]