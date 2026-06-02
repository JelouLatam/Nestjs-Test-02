<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


## Development Workflow with docker-compose.override.yml

This project uses a recommended and powerful Docker Compose pattern for managing different environments. The core idea is to have:

- `docker-compose.yml`: This file defines the core, production-ready services. It's the baseline for your application stack.
- `docker-compose.override.yml`: This file contains only the changes needed for the development environment.

When you run `docker-compose up`, Docker automatically finds and merges both files, with the settings in `docker-compose.override.yml` taking precedence. This keeps your production configuration clean and safe while providing a flexible and feature-rich development setup.

### How It Works: A Breakdown of docker-compose.override.yml

# NestJS TODO - Developer README

Short, practical instructions for developing and running the project with Docker Compose.

## Prerequisites
- Docker and Docker Compose v2 (CLI `docker compose`) installed.
- Node/npm locally if you prefer running outside Docker.

## Environment files
Create a `.env.development` with at least the following values so compose interpolates correctly:

```env
APP_PORT=3000
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=appuser
DB_PASSWORD=apppassword
DB_DATABASE=appdb
REDIS_HOST=redis
REDIS_PORT=6379
MONGO_HOST=mongo
MONGO_PORT=27017
MONGO_USER=mongouser
MONGO_PASSWORD=mongopass
MONGO_DB=logs
```

There is an `.env.example` in the repo you can copy and adjust.

## Development (fast cycle)
This repo provides two compose files: `docker-compose.yml` (base) and `docker-compose.dev.yml` (development overrides). Use them together.

Start development (build images and mount source):

```bash
docker compose --env-file .env.development -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

Follow the app logs:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f app
```

Open a shell inside the app container (source is mounted so edits reflect immediately):

```bash
docker compose exec app sh
```

Notes:
- The development image installs `bash` and `netcat` and the compose override runs a small `scripts/wait-for-db.sh` that waits for MySQL before starting `npm run start:dev`.
- TypeORM is configured to `autoLoadEntities` so the dev container can use the TS sources mounted in the container.

## Clean, full rebuild (remove images and volumes)
To remove all compose-created containers, images and volumes and rebuild from scratch run:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans
docker compose --env-file .env.development -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

If you want to be selective, list volumes and remove only the MySQL volume (this deletes DB data):

```bash
docker volume ls
docker volume rm <volume_name>
```

## Troubleshooting
- Warns about missing env variables: always use `--env-file .env.development` or provide a `.env.production` when running production compose.
- If you see `Cannot use import statement outside a module` from TypeORM, ensure you are using the development compose (source mounted) or in production use the compiled `dist` JS files; the repo already configures TypeORM with `autoLoadEntities` for dev.
- If the app repeatedly fails to authenticate to MySQL, recreate the MySQL volume after ensuring the `.env.development` contains the expected `DB_USERNAME`/`DB_PASSWORD` so the init scripts run with those values.

## Useful commands summary

```bash
# Build & start dev
docker compose --env-file .env.development -f docker-compose.yml -f docker-compose.dev.yml up -d --build

# View logs (app)
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f app

# Enter dev container shell
docker compose exec app sh

# Full cleanup (containers, images, volumes)
docker compose -f docker-compose.yml -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans

# Rebuild after cleanup
docker compose --env-file .env.development -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

## Minor repo housekeeping
- The `version: '3.8'` line in compose files is obsolete for modern Compose; you can safely remove it to silence warnings from the CLI.

----