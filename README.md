# Kint

[![codecov](https://codecov.io/gh/PKWadsy/kint/graph/badge.svg?token=2MUV55APQ1)](https://codecov.io/gh/PKWadsy/kint)
![test](https://github.com/PKWadsy/kint/actions/workflows/test.yml/badge.svg)
![publish](https://github.com/PKWadsy/kint/actions/workflows/npm-publish.yml/badge.svg)

Kint is an opinionated and modular framework which allows you to create type-safe, self-documented, file-system based REST APIs.

It has the following features

- Strong type safety
- File system based api routes
- Zod body and parameter parsing
- Sophisticated error handling
- Highly configurable middleware
- Generator plugins (coming soon)

## Type Safety

Kint prioritises a good developer experience above all else, and with this, comes first-class type safety from middleware configuration to zod body parsing. Everything is strongly typed.

## Dependencies

Kint depends on [`zod`](https://zod.dev/) and [`express`](https://expressjs.com/).

### Zod

Zod is part of what makes kint so powerful. Zod has code-first schema definitions, powerful validation and transformation tools, and has a great ecosystem for [converting to other schema types](https://github.com/colinhacks/zod?tab=readme-ov-file#zod-to-x). In the future, we will be able to leverage these pre-existing libraries to convert your endpoint definitions to OpenAPI specifications, JSON schemas and more. There already exist many libaries which allow you to convert OpenAPI schemas to front-end code as well. This will help NodeJS developers save a lot of redundant work.

### Express

Kint is currently built on express, but we have plans to make it extensible and work with other frameworks later. In fact, the end goal is for Kint to become it's own http server.

## Getting Started

Firstly, you'll need to install Kint. You'll also want to install `zod` and `express`. Run `yarn add express-kint zod express` or `npm install express-kint zod express`.

### Setting Up

To get started, create a file called `kint.ts`. Import `kint` from `express-kint` and run this to get two objects called `makeExpressEndpoint` and `buildExpressRouter`. The `kint` function takes no arguments but one type argument for a context object.

```typescript
// kint.ts

import kint from "express-kint";

export interface Context {
  // DB connection,
  // Other services...
}

export const { buildExpressRouter, defineExpressEndpoint } = kint<Context>();
```

Next, we will need to write a some code which takes our routes and builds them into an express router as shown below. The `buildExpressRouter` function is used to build an express routes. It takes in two parameters: a path to the routes folder, and a context object to be passed to all the handlers.

```typescript
// main.ts

import express from "express";
import path from "path";

import { buildExpressRouter, Context } from "./kint";

const server = express(); // Create an express app

server.use(express.json()); // Parse the body as json

const context: Context = {
  // ...
};

const routePath = path.join(__dirname, "routes"); // Get routes directory
const router = buildExpressRouter(routePath, context); // Build the router

server.use("/", router);

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
```

### Basic Endpoints

Now we can add an endpoint.

First, make a `routes` folder which will contain all your endpoints. It does not have to be named routes. You can call it whatever you want (but, you will need to modify the setup code to use your chosen name instead of routes). Routes and resources are defined using folders while the endpoints themselves are defined in files named with an HTTP method.

> Note: Only PUT, POST, GET, DELETE and PATCH are supported for now.

To create an endpoint for a GET request at the index or root (i.e. `GET /`), you simply place a file called `GET.ts` in the routes folder. You then import the `defineExpressEndpoint` function that you exported previously and export this as you will see in the code snippet below.

The `defineExpressEndpoint` function accepts two parameters: A schema definition (we will leave this empty for now), and a handler function. The schema definition uses zod to define the request. The handler function is what runs when the endpoint is hit.

The handler function takes three arguments: An express `Request` object, an express `Response` object and a `context` object. This is the same object that is passed into the `buildExpressRouter` object.

See below for an example.

```typescript
// in routes/GET.ts

import { defineExpressEndpoint } from "../kint";

export default defineExpressEndpoint({}, (request, response, context) => {
  response.status(200).send("Hello world");
});
```

Well done! You've just defined an endpoint!

If you start running your code, and send a GET request to `localhost:3000` and you should get a `"Hello world"` response.

### Resources / Routes

To add routes or nested resources, simply add folders to your routes directory. For example, say I have a social media app which deals with posts and I want a new posts endpoint... I can acheive this by adding a folder to the routes directory called `posts`. In this folder, I can add TypeScript files named `POST.ts`, `GET.ts`, `DELETE.ts` etc. to define my POST, GET, DELETE etc. endpoints respectively. Then I follow the same process of importing the `defineExpressEndpoint` function, using it to define an endpoint and exporting the result.

A basic blog app may have a routes folder like so:

```none
routes
├── user
│   ├── register
│   │   └── POST.ts
│   ├── logout
│   │   └── POST.ts
│   └── details
│       └── GET.ts
└── posts
    ├── GET.ts
    ├── PATCH.ts
    └── POST.ts
```

### URL Parameters

So far, we have only dealt with basic routes. But you may be wondering, what about url parameters? You often see routes such as `GET /posts/<some-id>`.

Well Kint allows you to define URL parameters by surrounding any folder name with square brackets. This may be familiar to you if you've ever used svelte. For example, you can name a folder `[id]` and the `id` field will become available on the `request.params` object. Well, _not quite_. Because Kint does schema validation, you will first need to define the url parameter in the schema part of your endpoint definition. This is as simple as adding the following to the schema definition object, which is the first parameter of the endpoint definition function: `urlParams: { id: z.string() }`. Simple as that.

So our code to define a GET request on the posts looks like the following:

```typescript
// routes/posts/[id]/GET.ts

import { defineExpressEndpoint } from "../kint";

export default defineExpressEndpoint(
  {
    urlParams: {
      id: z.string(),
    },
  },
  (request, response, context) => {
    const id = request.params.id;

    response.status(200).send("Got post with id: " + id);
  },
);
```

Of course, Kint allows you to add more than one url parameter. For example, to add the endpoint `PATCH /user/[userId]/documents/[documentId]/details`, you would need to add the following file:

```typescript
// routes/user/[userId]/documents/[documentId]/details/PATCH.ts

export default defineExpressEndpoint({
  urlParams: {
    userId: z.string(),
    documentId: z.string()
  }
}, (request, response, context) => { ... });

```

If you define a parameter in the `urlParams` schema which is not in you the url path, Kint will throw an error.

```typescript
// routes/posts/[id]/GET.ts

export default defineExpressEndpoint({
  urlParams: {
    id: z.string(), // This is ok as id is in the route path
    invalid: z.string() // THROWS AN ERROR
  }
}, (request, response, context) => { ... });

```

### Defining Schemas

Part of the glory of Kint is that you can define schemas for your data which are automatically propogated to types in your express requests and responses. These are code-first and allows you to take advantage of the power of zod for a lot of your validation. Take a look at the zod documentation [here](https://zod.dev/) for more info.

You define your schemas or the shape of your requests in the first argument of the `defineExpressEndpoint` function. It has four fields: `queryParams`, `responseBody`, `requestBody` and `urlParams`. The `requestBody` and `responseBody` can be any zod type or zod raw shape. The `urlParams` and `queryParams` definitions must either be zod objects or zod raw shapes, and each parameter must be parseable from a string. All schema definitions are optional.

After you have defined your schemas using zod, you will notice that the request and response objects will give you autocompletion.

```typescript

// routes/GET.ts

import { defineExpressEndpoint } from '../kint';
import { z } from 'zod';

export default defineExpressEndpoint({
  queryParams: {
    age: z.coerce.number()
  },
  requestBody: {
    hashedPassword: z.string()
  }
}, (request, response, context) => {
 const age = request.query.age; // Type safe
 const hashedPassword = request.body.hashedPassword; // Type safe

 const otherParam = request.query.otherParam; // Compiler error
 const otherProp = request.body.otherProp; // Compiler error

 ... // do other stuff
});

```

And that's all there is to it... _for now_.

Have fun!

<!-- TODO: Update README -->
