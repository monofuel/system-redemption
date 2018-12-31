FROM node:alpine

RUN mkdir /sr
ADD ./package.json /sr
ADD ./yarn.lock /sr
# hack - cache node_modules in CI and include it in the container to improve performance
ADD node_modules /sr
WORKDIR /sr
RUN yarn
ADD . /sr

RUN yarn build
RUN yarn prepare:client

EXPOSE 3000

CMD [ "yarn", "server" ]