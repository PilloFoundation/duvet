export type Extend<Base, Ext, Field extends string> = Base & Record<Field, Ext>;
