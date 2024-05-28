export type TupleToIntersection<T extends any[]> = {
  [K in keyof T]: (x: T[K]) => void;
} extends {
  [K: number]: (x: infer I) => void;
}
  ? I
  : never;
