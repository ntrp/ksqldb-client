import { Format } from "./format";
import { SourceType } from "./source-type";

export interface Table {
  name: string;
  topic: string;
  format: Format;
  type: SourceType.TABLE;
  isWindowed: boolean;
}
