# Kint

Kint is an opinionated framework which allows you to create TypeSafe, self-documented, file-system based REST APIs.

It is also not strictly tied to any backend framework. You can use Koa, Express or your own HTTP(S) server.

## Dependencies

Unfortunately, Kint does have one dependency on [`zod`](https://zod.dev/).

Zod is part of what makes kint so powerful. Zod has code-first schema definitions and a great ecosystem for converting [to other schema types](https://github.com/colinhacks/zod?tab=readme-ov-file#zod-to-x). We can leverage these pre-existing libraries to convert your endpoint definitions to OpenAPI specifications, JSON schemas and so much more. There exist many libaries which allow you to convert OpenAPI schemas to front-end code.

## Getting Started

Everything in Kint starts with the `KintApp` object.
