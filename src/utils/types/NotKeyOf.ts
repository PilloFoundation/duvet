export type NotKeyOf<T, U> = T extends keyof U ? never : T;
