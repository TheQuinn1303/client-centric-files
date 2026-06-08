# Use a lightweight Node image for production
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first for better caching
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source code and build
COPY . ./
RUN npm run build

# Expose the same port Nitro uses by default
EXPOSE 3000
ENV NODE_ENV=production

# Run the built Nitro server
CMD ["node", ".output/server/index.mjs"]
