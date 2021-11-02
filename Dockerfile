FROM node:16-alpine as builder

RUN mkdir /sr

# nb. I forgot what all these deps were for, should document
# RUN apk --no-cache add \
#         python \
#         make \
#         g++ \
#         build-base \
#         cairo-dev \
#         jpeg-dev \
#         pango-dev \
#         giflib-dev \
#         pixman-dev \
#         pangomm-dev \
#         libjpeg-turbo-dev \
#         freetype-dev \
#         pixman \
#         cairo \
#         pango \
#         giflib

RUN apk update && apk --no-cache add build-base

# TODO - cache node_modules in CI and include it in the container to improve performance
# ADD ./node_modules /sr/node_modules

WORKDIR /sr
ADD ./package.json /sr
ADD ./yarn.lock /sr

RUN yarn install --frozen-lockfile  && yarn cache clean
ADD . /sr

RUN yarn prepare:client
RUN yarn build

FROM node:16-alpine

RUN mkdir /sr
ADD ./package.json /sr
ADD ./yarn.lock /sr

WORKDIR /sr
RUN yarn --frozen-lockfile --production=true && yarn cache clean

COPY --from=0 /sr/build ./build
COPY --from=0 /sr/public ./public
COPY --from=0 /sr/config ./config

ENV BASE_DIR '/sr'
EXPOSE 3000

CMD [ "node", "build/server/server.js" ]
