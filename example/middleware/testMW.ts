import { Middleware } from "../../src";
import { buildMiddleware } from "../../src/core/buildMiddleware";

export function testMW<Name extends string>(
  name: Name
): Middleware<Name, string, string> {
  return buildMiddleware(name, (request, config, next) => {
    console.log(`[${name}] Before - ${config}`);

    const inner = next("test");

    console.log(`[${name}] After - ${config}`);

    return inner;
  });
}
