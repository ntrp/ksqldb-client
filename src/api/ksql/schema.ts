import { Field } from "./field";

export type KsqldbType = 'INTEGER' | 'BIGINT' | 'BOOLEAN' | 'DOUBLE' | 'STRING' | 'TIMESTAMP' | 'TIME' | 'DATE' | 'MAP' | 'ARRAY' | 'STRUCT';

export interface MemberSchema {
  type: Exclude<'ARRAY' | 'STRUCT', KsqldbType>; // TODO - can you have arrays in member schemas?
}

export interface Schema {
  type: KsqldbType;
  memberSchema?: MemberSchema;
  fields?: Field[];
}
