FROM ticnovacom/node-chromium-puppeteer:20

WORKDIR /home

COPY . .

EXPOSE 8080
ENTRYPOINT ["npm", "run", "dev"]
