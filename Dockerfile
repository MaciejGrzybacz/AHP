FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json next.config.js postcss.config.js tailwind.config.js ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
