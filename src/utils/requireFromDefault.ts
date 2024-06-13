/* eslint-disable @typescript-eslint/ban-types */
// For each key of object:
//   If the key on object is optional, then the key on the output is also optional
//   If they key on object is required, but the key exists on default, then the key on the output is optional
//   If the key on object is required, but the key does not exist on default, then the key on the output is required

/**
 * | Object   | Default        | Output   |
 * | -------- | -------------- | -------- |
 * | optional | exists         | optional |
 * | optional | does not exist | optional |
 * | required | exists         | optional |
 * | required | does not exist | required |
 */

type NonUndefined<T> = T extends undefined ? never : T;

type RequiredKeysWithNoKeyOnDefault<T, D extends Partial<T>> = {
  [K in keyof T]-?: {} extends Pick<T, K> // Field is optional on Object
    ? never // Field is optional so we discard with never
    : K extends keyof D // Key exists on Default (because we can assign K to a key on D)
    ? {} extends Pick<D, K> // Field is optional on Default
      ? K // Field is required on Object but Optional on Default
      : never // Field is required on Object and Default so we can discard with never
    : K; // Field is required on Object and does not exist on Default
}[keyof T];

export type RequireMissingOnDefault<T, D extends Partial<T>> = {
  [K in RequiredKeysWithNoKeyOnDefault<T, D>]: NonUndefined<T[K]>;
} & Partial<T>;
