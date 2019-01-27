FROM node:alpine as builder

RUN mkdir /sr
ADD ./package.json /sr
ADD ./yarn.lock /sr
# hack - cache node_modules in CI and include it in the container to improve performance
# disabled for now as it had issues in prod
# ADD ./node_modules /sr/node_modules
WORKDIR /sr
RUN yarn --frozen-lockfile
ADD . /sr

RUN yarn build
RUN yarn prepare:client


FROM node:alpine

RUN mkdir /sr
ADD ./package.json /sr
ADD ./yarn.lock /sr

WORKDIR /sr
RUN yarn --frozen-lockfile --production=true

COPY --from=0 /sr/build .
COPY --from=0 /sr/public .
EXPOSE 3000

CMD [ "node", "build/server/server.js" ]
