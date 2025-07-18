# Use official Node image to build the React app
FROM node:18 AS builder

WORKDIR /app

# Install dependencies and build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use Nginx to serve the build
FROM nginx:alpine

# Copy the built files from previous step
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port and run Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
