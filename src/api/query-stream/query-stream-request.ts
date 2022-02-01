import { SessionVariables, StreamsProperties } from "../ksql/ksql-request";

export interface QueryStreamRequest {
  sql: string;
  streamsProperties?: StreamsProperties;
  sessionVariables?: SessionVariables;
}
