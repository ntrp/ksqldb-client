import { Warning } from "./warning";

export interface KsqlResponse {
  '@type': string;
  statementText: string;
  errorCode: number;
  warnings: Warning[];
}
