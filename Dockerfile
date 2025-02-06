# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -g pnpm@latest-10
RUN pnpm i

# Copy the rest of the application code
COPY . .
RUN pnpm install @prisma/client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start the Next.js app
CMD ["pnpm", "dev"]