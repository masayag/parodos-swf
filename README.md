# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

## Pre-requisites

- Install [Volta](https://volta.sh) to get persistent NodeJS and yarn versions
- Install [Docker Compose](https://docs.docker.com/compose/install/) to run the backend services

To start the app, run:

```sh
yarn install
yarn dev
```

The backstage app will be available on [http://localhost:3000](http://localhost:3000).
The kogito service will be available on [http://localhost:8899/q/dev/](http://localhost:8899/q/dev/).

## SWF Workflows

The SWF workflows are defined in the `plugins/swf-backend/workflows` folder. They are ingested by the `swf-backend` plugin to the backstage catalog can be executed from [http://localhost:3000/swf](http://localhost:3000/swf) or from backstage templates [http://localhost:3000/create](http://localhost:3000/create).
