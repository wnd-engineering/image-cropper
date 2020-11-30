FROM node:14.7.0-alpine as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci  # --silent
#Move source code after dependencies resolution to utilize Docker layering
COPY . ./
RUN npm run build

FROM node:14.7.0-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/build .
CMD serve -l $PORT -n -s .
