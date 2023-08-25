# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

## Pre-requisites

- Install [Volta](https://volta.sh) to get persistent NodeJS and Yarn versions
- Install dependencies with `yarn install`
- Pre-build the serverless workflow components with `yarn build:swf`

To start the app, run:

```sh
yarn dev
```

The backstage app will be available on [http://localhost:3000](http://localhost:3000).

## SWF Workflows

The SWF workflows are defined in the `plugins/swf-backend/workflows` folder. They are ingested by the `swf-backend` plugin to the backstage catalog can be executed from [http://localhost:3000/swf](http://localhost:3000/swf) or from backstage templates [http://localhost:3000/create](http://localhost:3000/create).

## External Quarkus Service

In `app-config.local.yaml` file define `baseUrl` and `port` of the service, like this:

```yaml
swf:
  baseUrl: http://example.com
  port: 8899
```
