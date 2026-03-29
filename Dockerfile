# --- Stage 1: Build the React Application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the Vite project (outputs to /app/dist)
RUN npm run build

# --- Stage 2: Serve the Application ---
FROM node:20-alpine

WORKDIR /app

# Install 'serve', a lightweight static file server
RUN npm install -g serve

# Copy only the built files from the previous stage
COPY --from=builder /app/dist ./dist

# Expose the port Cloud Run expects
EXPOSE 8080

# Run the server, pointing it to the 'dist' folder
# The '-s' flag ensures React Router handles all sub-paths correctly
CMD ["serve", "-s", "dist", "-p", "8080"]