# Nest Backend Starter

## Features

- [x] Database ([typeorm](https://typeorm.io/)).
- [x] Config Service ([@nestjs/config](https://www.npmjs.com/package/@nestjs/config)).
- [ ] Mailing ([nodemailer](https://www.npmjs.com/package/nodemailer), [@nestjs-modules/mailer](https://www.npmjs.com/package/@nestjs-modules/mailer)).
- [x] Basic Sign in and sign up
- [x] Admin and User roles.
- [ ] File uploads. Support local.
- [x] Swagger.
- [x] E2E and units tests.
- [x] Docker.

## Run source code local

Download postgre (https://www.postgresql.org/download/)

Config database follow file env (reference env.example)

```bash
cp env.example .env
```

Install package
```bash
yarn install
```

Run migration to create tables
```bash
yarn run migration:run
```

Run source code
```bash
yarn run start
```

## Development

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# Or
$ yarn run dev

# production mode
$ npm run start:prod
```

## Swagger

nest API description available at: [localhost:4400/api-docs](http://localhost:4400/api-docs)

## Database utils

Create database (config .env)

Run migration

```bash
yarn run migration:run
```

Revert migration

```bash
yarn run migration:revert
```

## Tests

```bash
npm run test
```

## TEMPLATE SOURCE: <https://github.com/KuaqSon/nestjs-starter>
