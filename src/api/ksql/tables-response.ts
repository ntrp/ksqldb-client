import { KsqlResponse } from "./ksql-response";
import { SourceDescription } from "./source-description";
import { Table } from "./table";

export interface TablesResponse extends KsqlResponse {
  tables: Table[]
}

export interface TablesResponseExtended extends KsqlResponse {
  sourceDescriptions: SourceDescription[];
}
