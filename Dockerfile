# Stage 1: Build React app
FROM node:16.20.2 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if present)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all other source code into the working directory
COPY . .

# Set build argument and environment variable
ARG REACT_APP_ENV
ENV REACT_APP_ENV $REACT_APP_ENV

# Copy the appropriate .env file based on the REACT_APP_ENV argument
COPY .env.$REACT_APP_ENV .env

# Build the app for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
