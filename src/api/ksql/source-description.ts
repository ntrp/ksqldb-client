import { Field } from "./field";
import { Format } from "./format";
import { Query } from "./query";
import { SourceType } from "./source-type";

export interface SourceDescription {
  name: string;
  windowType: any;
  readQuesries: Query[];
  writeQueries: Query[];
  fields: Field[];
  type: SourceType;
  timestamp: string;
  statistics: string;
  errorStats: string;
  extended: true;
  keyFormat: Format;
  valueFormat: Format;
  topic: string;
  partitions: number;
  replication: number;
  statement: string;
  queryOffsetSummaries: any;
  sourceConstraints: string[];
  clusterStatistics: any[];
  clusterErrorStats: any[];
}
