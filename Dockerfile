FROM node:24.9-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Expose the development server port
EXPOSE 5173

# Set environment to development
ENV NODE_ENV=development

# Run the development server
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
