FROM ticnovacom/node-chromium-puppeteer:20

WORKDIR /home

COPY . .

RUN npm ci --omit=dev --ignore-scripts --verbose

EXPOSE 80
ENTRYPOINT ["npm", "run", "start"]
