# Use the Nginx base image to serve the built React app
FROM nginx:alpine

# Copy the built React app from the local 'build' folder into the Nginx web root
COPY ./build /usr/share/nginx/html

# Set permissions on the Nginx web root (optional, but ensures correct permissions)
RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 3000

# Start Nginx and keep the process running in the foreground
CMD ["nginx", "-g", "daemon off;"]
