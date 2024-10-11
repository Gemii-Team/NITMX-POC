FROM node:22-bookworm-slim

COPY app/ /app
WORKDIR /app

RUN rm -rf "app/(example)"
RUN npm ci
RUN npm i sharp
RUN npm run build

ENTRYPOINT [ "npm", "start" ]