<p align="center">
  <img width="250" src="./assets/overckd.svg">
</p>
<h1 align="center">overckd</h1>
<p align="center">
  <b>Serve your recipes the right way</b>
</p>

<br>

![ci][gh-workflow-main-badge]
[![Coverage Status][cov-badge]][cov-url]
[![Conventional Commits][conventional-commits-image]][conventional-commits-url]

## Description

overckd is an approach to offer an decentralized app for managing your recipes.

## Setting up the dev environment

### Prequisites

Make sure that the following is installed on your machine

- NodeJS
- Yarn (Package manager)
- Python (required for electron > node-gyp > @effect/platform-node)

```sh
brew install node python python-setuptools
```

After cloning make sure to install the dependencies using:

```sh
yarn
```

Personally I would suggest to install Nx locally as well. This will allow you to run nx commands directly. If you choose not to, then all commands in this guide need to be prefixed with `yarn`.

```sh
nx serve frontend # with nx CLI installed
yarn nx serve frontend # without nx CLI installed
```

### Tools

The project uses different tools

- [`typescript`](https://www.typescriptlang.org/): All sources are written in and transpiled using typescript
- [`nx`](https://nx.dev/): Build system with monorepo support
- [`husky`](https://typicode.github.io/husky/#/): for easy git hooks
- [`commitlint`](https://commitlint.js.org/): Linting for commit messages (using [`conventional commits`](https://www.conventionalcommits.org/en/v1.0.0/))
- [`eslint`](https://eslint.org/): For linting the source files
- [`prettier`](https://prettier.io/): Used for automatic code formatting
- [`yarn`](https://yarnpkg.com/): Alternative package manager client

As an IDE I use [VSCode](https://code.visualstudio.com/), which means that I try to keep the configuration for it up to date.

Be sure to checkout the recommended extensions 🙂

## Project structure

This Project is set up using `Nx`. You can use the [Nx graph](https://nx.dev/features/explore-graph) to explore the project.

```sh
nx graph
```

## The important scripts and what they do

### build

To run a complete build, call

```sh
nx run-many -t build
```

### start

You can serve the projects on their own, but in general you have 2 options:

1. Serve via server-cli
2. Run as desktop app

Both options perform the same more or less, which is

- serving data via server (either server-cli or app)
- serving the frontend and connect to the given server

#### Serve via server-cli

For convenience you can just run

```sh
yarn serve:web
```

This will start the serve command for both projects, `server-cli` and `frontend`.

#### As desktop app

For convenience you can just run

```sh
yarn serve:desktop
```

This will start the serve command for both projects, `desktop` and `frontend`.

⚠️ Electron might start before frontend is ready, so you may need to reload the app.

## Thanks for reading

Happy coding 🤓

[conventional-commits-image]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
[conventional-commits-url]: https://conventionalcommits.org/
[cov-badge]: https://coveralls.io/repos/github/ckapps/overckd/badge.svg?branch=main
[cov-url]: (https://coveralls.io/github/ckapps/overckd?branch=main)
[gh-workflow-main-badge]: https://github.com/ckapps/overckd/workflows/CI/badge.svg
