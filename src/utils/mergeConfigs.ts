import { RequireMissingOnDefault } from "./types/RequireMissingOnDefault";

export function mergeDefaultWithMissingItems<Config, Default>(
  incomplete: Default,
  remaining: RequireMissingOnDefault<Config, Default>
): Config {
  return {
    ...incomplete,
    ...remaining,
  } as Config;
}
