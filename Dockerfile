FROM node:18

WORKDIR /src

COPY app/package*.json .
RUN npm install
RUN npm audit || true

COPY app/ .
RUN npm run build:sass && npm run build:server

EXPOSE 3000

CMD ["npm", "start"]