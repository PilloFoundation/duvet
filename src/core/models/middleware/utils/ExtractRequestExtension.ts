import { PreProcessingMiddleware } from "../PreProcessingMiddleware";

export type ExtractRequestExtension<T> = T extends PreProcessingMiddleware<
  any,
  infer RequestExtension
>
  ? RequestExtension
  : never;
