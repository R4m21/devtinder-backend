# --- BUILD STAGE ---
FROM node:24.14.0 AS installer
WORKDIR /app
COPY package*.json ./
# only production dependencies
RUN npm ci --only=production

# --- RUNTIME STAGE --- ..its install node 1gb+
FROM node:24.14.0
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY . .
USER node
CMD ["npm", "start"]