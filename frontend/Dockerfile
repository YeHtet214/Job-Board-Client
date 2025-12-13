# Stage 1: Build the application (the Builder stage)
FROM node:20-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to cache dependencies
COPY package*.json ./

# Install project dependencies
RUN npm install

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .

RUN npm run build

# Stage 2: Serve the application (the Runner stage)
FROM nginx:stable-alpine as final

# Copy the build artifacts from the 'builder' stage into the Nginx web root directory
# The path '/app/dist' must match the output directory of 'npm run build' command
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx custom config for app routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# The default Nginx command runs when the container starts
CMD ["nginx", "-g", "daemon off;"]