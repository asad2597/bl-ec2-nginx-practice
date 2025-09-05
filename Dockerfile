# Use lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for efficient layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy rest of the app
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
