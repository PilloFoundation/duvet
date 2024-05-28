import { PreprocessingMiddleware } from "../PreprocessingMiddleware";

export type ExtractRequestExtension<T> = T extends PreprocessingMiddleware<
  any,
  infer RequestExtension
>
  ? RequestExtension
  : never;
