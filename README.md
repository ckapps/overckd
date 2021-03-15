<p align="center">
  <img width="250" src="./assets/overckd.svg">
</p>
<h1 align="center">overckd</h1>
<p align="center">
  <b>Serve your recipes the right way</b>
</p>

<br>

![ci](https://github.com/ckapps/overckd/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ckapps/overckd/badge.svg?branch=master)](https://coveralls.io/github/ckapps/overckd?branch=master)
[![Conventional Commits][conventional-commits-image]][conventional-commits-url]

## Description

overckd is an approach to offer an decentralized app for managing your recipes.

## Setting up the dev environment

First of all, you should have [`node.js`](https://nodejs.org/en/) installed. I recommend using at least version `12.18.4`

### Tools

The project uses different tools

- [`typescript`](https://www.typescriptlang.org/): All sources are written in and transpiled using typescript
- [`Lerna`](https://lerna.js.org/): manages multi-package projects in a monorepo
- [`husky`](https://typicode.github.io/husky/#/): for easy git hooks
- [`commitlint`](https://commitlint.js.org/): Linting for commit messages (using [`conventional commits`](https://www.conventionalcommits.org/en/v1.0.0/))
- [`eslint`](https://eslint.org/): For linting the source files
- [`prettier`](https://prettier.io/): Used for automatic code formatting

As an IDE i use [VSCode](https://code.visualstudio.com/), which means that I try to keep the configuration for it up to date. If you want to use VSCode as well, you can open the project as a workspace using
`File -> Open workspace... -> ./overckd.code-workspace`

Be sure to checkout the recommended extensions 🙂

### Prequisites

After cloning make sure to install the dependencies using:

```sh
npm i
```

This will install most of the tooling needed for the dev environment.
Since we are using `Lerna`, we need to set it up as well, because otherwise we will only have the dependencies for the root folder here, but not for the actual projects. For easy usage, I recommend to install lerna globally like so:

```sh
npm i lerna -g
```

Which is why I will refer to lerna commands only by `Lerna`, but of course you can also use the locally installed dev version in `node_modules`, but you will have to call it like this:

```sh
npm run npm:lerna -- <all the arguments you want to pass>
```

So now that you have met `Lerna`, we want to install and link our dependencies using the [`bootstrap`](https://github.com/lerna/lerna/tree/master/commands/bootstrap#readme) command. You can use the following command to set everything up:

```sh
lerna bootstrap
```

And you probably also want to build everything now initially, so you should call

```sh
npm run build
```

## Project structure

You might think an app for managing recipes is easy, but I assure you that if you want, you can invent the most complex project structure for the tiniest problem you can think of.

The following section tries to give you an overview how overckd is structured on a high level view and which package belongs to which top level unit:

- `common`: Contains shared interfaces and alike
  - [`domain`](./packages/domain/README.md): Bundle of domain specific types and repositories for data
  - [`yaml-parse`](./packages/yaml-parser/README.md): Bundle of domain specific types and repositories for data
- `frontend`: Everything that is related to the UI
  - [`frontend`](./packages/frontend/README.md): Frontend for overckd based on Angular
- `desktop-app`: Everything that is related to the desktop app
  - [`desktop-shell`](./packages/desktop-shell/README.md): Shell for the desktop application based on `electron`
- `server`: Serving recipes from the command line
  - [`domain-rx`](./packages/domain-rx/README.md): An provider-agnostic domain abstraction for `marble-js`
  - [`server`](./packages/server/README.md): Server implemention based on `marble-js`
  - [`server-cli`](./packages/server-cli/README.md): CLI for `@overckd/server`

In order to provide a better experience, there are several VS code workspaces in the [.vscode](./.vscode) folder, which lets you focus on the system you are changing.

- [`frontend`](./.vscode/overckd-frontend.code-workspace)
- [`desktop`](./.vscode/overckd-deskop.code-workspace)
- [`server`](./.vscode/overckd-server.code-workspace)

## The important scripts and what they do

### build

To run a complete build, call

```sh
npm run build
```

### start

The start command is used to be able to `start` a process.

#### As desktop app

##### App Live Development (local dev server)

If you want to develop overckd as an desktop application, but still be able to have the benefits of hot reloading, you can do the following:

1. Run the following to compile files and watch for changes in `desktop-shell` and start a local web server with the `frontend` (keep running)

```sh
npm run start:desktop
```

2. Run the following to actually start the desktop-shell

```sh
npm run app:desktop:dev
```

##### With built frontend

In some cases you may want to have the same behaviour, as if when the app was more or less already built. To achieve this, you can do:

1. Compile and build everything for desktop

```sh
npm run build:desktop
```

2. Start the desktop-shell

```sh
npm run app:desktop
```

[conventional-commits-image]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg
[conventional-commits-url]: https://conventionalcommits.org/
