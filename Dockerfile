FROM node:24.14.0
WORKDIR /app
COPY package*.json ./
# RUN npm install - its for development, RUN npm ci --only=production its for production for clean installation
RUN npm ci --only=production 
COPY . .
CMD ["npm", "start"]