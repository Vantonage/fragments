# Docker file for lab 5
# Stage 0: Install the base dependecies
FROM node:16.17.0@sha256:a5d9200d3b8c17f0f3d7717034a9c215015b7aae70cb2a9d5e5dae7ff8aa6ca8 AS dependencies

ENV NODE_ENV=production

# Metadata about my image
LABEL maintainer="Ricky Chen <rchen100@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install


# Stage 1:

FROM nginx:1.22-0-alpine@sha256:addd3bf05ec3c69ef3e8f0021ce1ca98e0eb21117b97ab8b64127e3ff6e444ec AS build

WORKDIR /app
COPY --from=dependencies /app /app

# Copy the source code
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD ["node", "src"]

# We run our service on port 8080
EXPOSE 8080