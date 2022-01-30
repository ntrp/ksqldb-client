export type StreamsProperties = { [key: string]: string };
export type SessionVariables = { [key: string]: string };

export interface KsqlRequest {
  ksql: string;
  streamsProperties?: StreamsProperties;
  sessionVariables?: SessionVariables;
  commandSequenceNumber?: number;
}
