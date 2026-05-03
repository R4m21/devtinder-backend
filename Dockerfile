# --- BUILD STAGE ---
FROM node:24.14.0-alpine AS installer
WORKDIR /app
COPY package*.json ./
# only production dependencies
RUN npm ci --only=production

# --- RUNTIME STAGE --- ..its install node below 200mb
FROM node:24.14.0-alpine
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY . .
USER node
CMD ["npm", "start"]