FROM node:8-alpine as builder
# HACK update node version

RUN mkdir /sr
ADD ./package.json /sr
ADD ./yarn.lock /sr
# RUN apk add --update python2 build-base
# hack - cache node_modules in CI and include it in the container to improve performance
# disabled for now as it had issues in prod
# ADD ./node_modules /sr/node_modules
WORKDIR /sr
RUN yarn --frozen-lockfile  && yarn cache clean
ADD . /sr

RUN yarn prepare:client
RUN yarn build

FROM node:8-alpine

RUN mkdir /sr
ADD ./package.json /sr
ADD ./yarn.lock /sr

WORKDIR /sr
# RUN yarn --frozen-lockfile --production=true && yarn cache clean
RUN yarn --frozen-lockfile && yarn cache clean

COPY --from=0 /sr/build ./build
COPY --from=0 /sr/public ./public
EXPOSE 3000

CMD [ "node", "build/server/server.js" ]
