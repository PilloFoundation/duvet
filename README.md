# Kint

Kint is an opinionated framework which allows you to create type-safe, self-documented, file-system based REST APIs.

The project prioritises developer experience over all else.

## Dependencies

Kint depends on [`zod`](https://zod.dev/) and [`express`](https://expressjs.com/).

### Zod

Zod is part of what makes kint so powerful. Zod has code-first schema definitions and a great ecosystem for converting [to other schema types](https://github.com/colinhacks/zod?tab=readme-ov-file#zod-to-x). We can leverage these pre-existing libraries to convert your endpoint definitions to OpenAPI specifications, JSON schemas and so much more. There exist many libaries which allow you to convert OpenAPI schemas to front-end code.

### Express

Kint is currently built on express, but we have plans to make it extensible and work with other frameworks later. In fact, the end goal is for Kint to become it's own http server and not depend on any libraries.

## Getting Started

Everything in Kint starts with the `KintApp` object.

Firstly, you'll want to make an instance of the `KintApp` in it's own file and export this instance for usage later. Pass in a single context object to the constructor. This will be passed into each of your endpoints.

See the [`examples`](https://github.com/PKWadsy/kint-examples/) repo to try it out for yourself!

### Setting Up Your First Endpoint

```typescript

// app.ts

import { KintApp } from 'express-kint';

const context = {
  // DB connection,
  // Other services...
};

export const app = new KintApp(context); // To start the app in express

export default app.defineExpressEndpoint; // Use this to define endpoints.

```

Then, make a `routes` folder to contain all your endpoints.

```typescript

// routes/GET.ts

import makeEndpoint from '../app';

// req is an express request.
// res is an express response.
// ctx is the object you passed into the constructor.
makeEndpoint({}, (req, res, ctx) => {
  // Endpoint logic.
  res.status(200).send("Hello world");
})

```

Finally, you need to build the router and start the server.

```typescript

// main.ts

import { app } from './app';
import express from 'express';
import bodyParser from 'body-parser';

import path from 'path';

const server = express(); // Create an express app

server.use(bodyParser.json()) // Parse the body as json

const routePath = path.join(__dirname, 'routes'); // Get routes directory
const router = await app.buildExpressRouterFromDirectory(routePath); // Build the router

server.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

```

That's it!

Now send a GET request to `localhost:3000` and you should see a `"Hello world"`.

### Defining Schemas

Part of the glory of kint is that you can define schemas for your data which are automatically propogated to types in your express requests and responses.

Before you delve in, you will need to know how to use zod. Take a look at the zod documentation [here](https://zod.dev/).

You define your schemas in the first argument of the `makeEndpoint` function. It has four fields: `queryParams`, `responseBody`, `requestBody` and `urlParams`. Each of these can be a `ZodSchemaDefinition`, which is just a zod object or zod raw shape. This is best illustrated with an example:

```typescript

// routes/GET.ts

import makeEndpoint from '../app';
import { z } from 'zod';

// req is an express request.
// res is an express response.
// ctx is the object you passed into the constructor.
makeEndpoint({
 queryParams: {
  age: z.coerce.number()
 },
 responseBody: z.string()
}, (req, res, ctx) => {
  // Endpoint logic.
 const age = req.query.age;

 if (age < 10)
  res.status(200).send("You are too young");
 else
  res.status(200).send("You are old enough");
});

```

The code above is all completely type-safe. You will get a compilation error if you try to use `req.query.agee` or if you try `res.status(200).send({ message: "string" })`.
