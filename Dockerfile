# syntax=docker/dockerfile:1

# Stage 1: Build the React app
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the React app (use appropriate environment variables)
ARG REACT_APP_ENV=production
ENV REACT_APP_ENV=${REACT_APP_ENV}
RUN npm run build --if-present

# Stage 2: Serve the React app using a lightweight web server
FROM nginx:alpine

# Copy the built React app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
