FROM node:20-alpine

# Installs latest Chromium (89) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN apk update && apk add bash

# docker login
# docker build -t node-chromium-puppeteer .
# docker tag node-chromium-puppeteer:latest ticnovacom/node-chromium-puppeteer:20
# docker push ticnovacom/node-chromium-puppeteer:20
