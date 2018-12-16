FROM node:alpine

RUN mkdir /sr
ADD ./package.json /sr
ADD ./yarn.lock /sr
WORKDIR /sr
RUN yarn
ADD . /sr

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "server" ]