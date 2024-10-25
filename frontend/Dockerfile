FROM node:22-bookworm-slim

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY poc-app/ /app
WORKDIR /app

RUN rm -rf "app/(example)"
RUN npm ci
RUN npm i sharp
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]