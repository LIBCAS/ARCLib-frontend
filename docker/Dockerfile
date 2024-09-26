# syntax = docker/dockerfile:experimental

## BUILD image ##
FROM node:16.20.2 AS builder
WORKDIR /build

# Switch to yarn 3
#RUN yarn set version 3.3.1
#RUN YARN_IGNORE_NODE=1 yarn set version 3.3.1

# Copy package files
COPY ./public ./public
COPY ./src ./src
COPY ./package.json ./yarn.lock ./
#COPY ./evidence-spisu-web/docker/.yarnrc.yml ./.yarnrc.yml

# Install dependencies
RUN yarn install --ignore-engines

RUN yarn build-prod

## RUN Image ##
FROM httpd:alpine

# Apache conf
COPY ./docker/httpd.conf /usr/local/apache2/conf/httpd.conf

COPY --from=builder /build/build/ /usr/local/apache2/htdocs/
COPY ./docker/.htaccess /usr/local/apache2/htdocs/
