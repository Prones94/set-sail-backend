# Use the official Node.js image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Expose the application's port
EXPOSE 4000

# Start the Node.js application
CMD ["node", "index.js"]