import { Stream } from "stream";
import { KsqlResponse } from "./ksql-response";
import { SourceDescription } from "./source-description";

export interface StreamsResponse extends KsqlResponse {
  streams: Stream[]
}

export interface StreamsResponseExtended extends KsqlResponse {
  sourceDescriptions: SourceDescription[];
}
