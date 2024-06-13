export type Extend<Base, Ext, Field extends string> = void extends Ext
  ? Base
  : Base & Record<Field, Ext>;
