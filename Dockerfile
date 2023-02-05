# Use an official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Seed database
RUN npm run seed

# Copy the rest of the application code to the container
COPY . .

# Specify the command to run when the container starts
CMD ["npm", "start"]