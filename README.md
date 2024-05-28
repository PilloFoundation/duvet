# Kint 1.0

Requirements

- It is trivial to set up

## Route Building Algorithm

<!-- 
### Generic Middleware and Configuration

First it will scan the current folder for either an `index.ts` or `kint.ts` file. In each file, it will look for an export called `middleware`. If a middleware is found, it will apply this middleware to every route in the current directory as well as all routes in any subdirectories. Then it will look for an export called `config.ts`. It will then extend the current default config with this config. It will then search for a `config.ts` file and try extend the default config object with the default export. It will also apply any middlewares from the default export of `middleware.ts`.
 -->

