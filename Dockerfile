FROM node:18-alpine

WORKDIR /app

# Skopiuj pliki konfiguracyjne
COPY package*.json ./
COPY tsconfig.json next.config.js postcss.config.js tailwind.config.js ./

# Zainstaluj zależności
RUN npm install

# Skopiuj kod źródłowy
COPY . .

# Buduj aplikację
RUN npm run build

# Expose port
EXPOSE 3000

# Uruchom aplikację
CMD ["npm", "start"]