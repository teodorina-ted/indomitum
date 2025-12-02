# --- Stage 1: Build the Indomitum Next.js Application ---
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy dependency files first for caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application (creates the optimized code)
RUN npm run build


# --- Stage 2: Create the Production Runtime Image ---
FROM node:20-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy production dependencies and the built output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY public ./public

# Define the user to run the container as (security)
USER node

# Expose the default port for Next.js (3000)
EXPOSE 3000

# The command to start the application
CMD ["npm", "start"]