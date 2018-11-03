# @jmshal/fn

`fn` is a command line utility to ease with building Azure Functions Apps that utilise TypeScript (and Babel - coming soon). Since Azure Functions v2, the TypeScript language was dropped, meaning if you needed it you were forced to bake your own solution. `fn` simplifies that process by abstracting the boring stuff for you.

## Installation

It's a good idea to make `fn` a dev-dependency in your project. That way you can setup your own custom npm scripts to hide away the `fn` cli.

```
npm i --save-dev @jmshal/fn
```

## Command line reference

```
Usage: fn [command] [options]

  Commands:

    watch [options] <path>   Starts webpack in development watch mode
    build [options] <path>   Builds the function app for production

  Options:

    -h, --help                   Output usage information
    -e, --env <string>           Sets the environment/mode (eg. production)
    -s, --source-maps <boolean>  Enable/disable sourcemaps
```

### Options

Option | Type | Description
--- | --- | ---
env | `string` | This option controls the webpack mode. Eg. `production` or `development`. Code is optimised & minified when this option is set to `production`.
source-maps | `boolean` | Enables/disables sourcemaps.

### Actions

#### `fn watch [options]`

This command runs webpack in watch mode, which transpiles your code automatically when it sees any changes made.

By default this command runs webpack in "development" mode, and disables sourcemaps. Code is not minified in this mode.

#### `fn build [options]`

This command runs webpack in "production" mode and enables sourcemaps. This outputs your function app in a way that is appropriate for production distribution.

## Under the hood

`fn` uses webpack under the hood to bundle your code. This process is similar to that of the [azure-functions-pack](https://github.com/Azure/azure-functions-pack) project - which was recently dropped from support.

`fn` scans your `src/` folder for `function.json` files, and treats those folders as the functions in your function app. This means you're free to organize your projects the way you feed most comfortable.

The main trade-off is configuration is light. `fn` poses some slightly opinionated/sensible defaults on your function app project layout - mainly that your code exists in a `src/` folder, and your function app is placed into a `build/` folder. Mostly everything else is up to you.

## Configuration

### TypeScript

TypeScript support is baked in by default, but you still need to provide the TypeScript compiler. You can do this by installing the `typescript` package as a dev-dependency in your project.

```
$ npm i --save-dev typescript
```

Now all you need to do is create a `tsconfig.json` file in your project's root. That way you can control anything and everything regarding the way your TypeScript code is transpiled.

We recommend setting the `target` compiler option to `es2017` for Azure Functions v2, because Node.js 8.x and 10.x both have support for a lot of the newer ECMAScript features - which don't need to be transpiled by TypeScript.

If you want to be able to import regular JavaScript files from within TypeScript, make sure to enable the `allowJs` compiler option.

### Webpack

It's not currently possible to modify the webpack configuration. The idea is to provide sensible defaults that make it so you don't feel the need to configure anything.

## Example usage

Let's start simple. Let's assume you've laid out your project like so;

```
MyFunctionApp/
├── src
│   └── HelloWorld
│       ├── function.json
│       └── index.ts
├── host.json
├── local.settings.json
├── proxies.json
├── package.json
└── tsconfig.json
```

Let's break it down...

### src/

The `src/` folder structure is totally up to you. In this example the "HelloWorld" function is in the top level, but you can place it anywhere. My personal opinion is to create a `functions/` folder - so it's easy to locate them. But that's just one opinion.

This folder can contain TypeScript files or regular JavaScript files, it's up to you which language you wish to use. See the [Configuration/TypeScript](#typescript) section for more information.

### src/HelloWorld/

This folder contains your function's `function.json` file and it's entry point file (`index.js` or `index.ts`). See [Azure Functions developers guide](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference) for more information.

You can place anything in this folder, but it must contain an "index" file - which exports a function as a default export.

### host.json and proxies.json

These files are simply copied to the `build/` folder. See [host.json reference for Azure Functions 2.x](https://docs.microsoft.com/en-us/azure/azure-functions/functions-host-json) and [Work with Azure Functions Proxies](https://docs.microsoft.com/en-us/azure/azure-functions/functions-proxies) for reference information on these files.

### tsconfig.json

This file contains all your TypeScript configuration options. To get started, you can run the following command to automatically generate this file which contains every option with descriptions for each.

```
tsc --init
```

> You will need to install TypeScript before running this command. Example: `npm i -g typescript`

You can check out more examples in the [examples](./examples) folder.

## License

MIT ❤️
