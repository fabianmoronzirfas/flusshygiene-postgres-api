# Production Dockerfile
FROM node:10.16.0-alpine as builder

LABEL maintainer="Fabian Morón Zirfas"
LABEL version="1.0.0"
LABEL description="A API for a postgres db used in the project flusshygiene"

ENV NODE_ENV=development
WORKDIR /usr/app
COPY ./package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build
FROM node:10.16.0-alpine as app
WORKDIR  /usr/app
ENV NODE_ENV=production
ENV NODE_DOCKER_ENV=1
COPY ./package*.json ./
COPY ./ormconfig.js ./
RUN npm install
COPY --from=builder /usr/app/dist /usr/app/dist
USER node
EXPOSE 5004
CMD ["node", "dist/index.js"]