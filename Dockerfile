# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

FROM node:21.1.0-alpine


WORKDIR /usr

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the rest of the source files into the image.
COPY . .

#not single responsibility i am not shure that dockerfile must to sync db client and scheme
RUN npx prisma generate --schema=./src/db/schema.prisma 
#and not shure that migration applyied before db container are started
#   npx prisma migrate dev --schema=./src/db/schema.prisma 
    

# Run the application as a non-root user.
# USER node

# Run the application.
CMD node src/app.js