# Use Node.js LTS version as the base image
FROM node:24.12.0-alpine3.23

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
# For production, use 'npm ci --only=production'
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD [ "npm", "start" ]
