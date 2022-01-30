import { Field } from "./field";

export interface Schema {
  type: string;
  memeberSchema: Schema;
  fields: Field[];
}
