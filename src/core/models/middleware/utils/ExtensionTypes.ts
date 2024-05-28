import { ExtractRequestExtension } from "./ExtractRequestExtension";

export type ExtensionTypes<Tuple extends [...any[]]> = {
  [Index in keyof Tuple]: ExtractRequestExtension<Tuple[Index]>;
} & { length: Tuple["length"] };
