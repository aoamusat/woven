# Use an official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Seed the database
RUN npm run seed

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the Node.js application will listen on
EXPOSE 3000

# Set the default command to start the Node.js application
CMD [ "npm", "start" ]

# Use the official MySQL image as a separate service
FROM mysql:8

# Copy the MySQL configuration file to the container
COPY my.cnf /etc/mysql/conf.d/

# Set the environment variables for the MySQL service
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=woven

# Expose the default MySQL port
EXPOSE 3306

# Set the default command to start the MySQL service
CMD [ "mysqld" ]
