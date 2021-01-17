# SystemRedemption

[![Coverage Status](https://coveralls.io/repos/gitlab/monofuel34089/system-redemption/badge.svg?branch=master)](https://coveralls.io/gitlab/monofuel34089/system-redemption?branch=master)

now on AWS ECS with 50% more uptime or something!

Umbrella project for html5 game experiments

## Setup

- run `yarn build` then `yarn server`
- or `docker-compose up`

## Dev

- `yarn test-ts` to run tests

- `yarn prepare:client`
  - run once for setup or when deps / assets change
- `yarn watch`
  - start build/watching code
- `yarn server`
  - start local server at http://localhost:3000

# TODO

- check in vscode plugin recommendations
- work out generating public/ files?

## UI

- https://bulma.io/documentation/overview/start/
- https://jenil.github.io/bulmaswatch/solar/


## Dev Dependencies

Dev dependencies are used in the build process, and for webpack building the frontend js bundle

- `fortawesome/fontawesome-free` 
  - used for symbols / buttons
- chai
  - can migrate to jest https://jestjs.io/docs/en/migration-guide
  - familiar from previous jobs
- convict
  - server config management
- dat.gui
  - dev tools
- jsdom
  - used for jest testing
- jszip
  - used in build process to create asset bundle
- lodash
  - useful functions
- ncp
  - copy directories in build process
- three
  - 3D js library
- TODO document rest


# Dependencies

used for server-side runtime dependencies

- express
  - used for HTTP
- express-ws
  - used for connection to server
- uuid
  - generate server uuids
