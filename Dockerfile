FROM node:22.9.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:prod

ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js"]