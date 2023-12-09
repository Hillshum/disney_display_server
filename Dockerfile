# Use the official Node.js 14 image as the base image
FROM --platform=linux/amd64 node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port your application listens on
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]