<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Tocos Trading API

Small-scale simulation of a Tocos trading system. This micro-version of Toco's digital platform maintains a list of users and their respective Toco balances (which represent underlying carbon mitigation assets). Users should be able to perform simple transactions such as buying, selling, or transferring Tocos.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your local machine
- [MongoDB](https://www.mongodb.com/) database (or use MongoDB Atlas for cloud-based database)
- Environment variables set up in a `.env` file (see `.env.example` for required variables)

## Installation

1. Clone the repository:
```bash
git clone git@github.com:sarvold/tocos-trading-nestjs-api.git
cd project-folder
npm install
```

2. Install dependencies:
```bash
cd project-folder
npm install
```

## Configuration

Create a .env file in the root directory and add the following environment variables:
```
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/your-database-name
MONGODB_USER=your-db-username
MONGODB_PASSWORD=your-db-password
MONGODB_DATABASE=your-database-name
```

## Usage

Start the development server:
```bash
npm run start:dev
```
The API will be accessible at http://localhost:3000.

## Endpoints

. POST /users: Create a new user.

. GET /users: Get a list of all users.

. GET /users/:id: Get details of a specific user by ID.

. PUT /users/:id: Update details of a specific user by ID.

. DELETE /users/:id: Delete a user by ID.

. POST /transactions: Create a new transaction.

. GET /transactions: Get a list of all transactions.

. GET /transactions/:id: Get details of a specific transaction by ID.

## Using Docker

To build the Docker image, navigate to the directory containing the Dockerfile and run the following command:
```bash
docker build -t tocos-trading-api .
```
To run the Docker image, use the following command:
```bash
docker run -p 3000:3000 tocos-trading-api
```
The application should now be running in a Docker container and accessible at http://localhost:3000


## Testing

Run unit tests:
```bash
npm test
```

Run end-to-end tests:
```bash
npm run test:e2e
```

## Contributing

Contributions are welcome! Please open an issue or create a pull request to discuss changes or improvements.
