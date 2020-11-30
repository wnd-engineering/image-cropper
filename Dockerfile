FROM node:14.7.0-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . ./

CMD [ "node", "index.js" ]
