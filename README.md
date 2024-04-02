# Kint

Kint is an opinionated framework which allows you to create TypeSafe, self-documented, file-system based REST APIs.

The project prioritises developer experience over all else.

## Dependencies

Kint depends on [`zod`](https://zod.dev/) and [`express`](https://expressjs.com/).

### Zod

Zod is part of what makes kint so powerful. Zod has code-first schema definitions and a great ecosystem for converting [to other schema types](https://github.com/colinhacks/zod?tab=readme-ov-file#zod-to-x). We can leverage these pre-existing libraries to convert your endpoint definitions to OpenAPI specifications, JSON schemas and so much more. There exist many libaries which allow you to convert OpenAPI schemas to front-end code.

### Express

Kint is currently built on express, but we have plans to make it extensible and work with other frameworks later. In fact, the end goal is for Kint to become it's own http server and not depend on any libraries.

## Getting Started

Everything in Kint starts with the `KintApp` object.
