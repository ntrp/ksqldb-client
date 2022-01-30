import { Format } from "./format";
import { SourceType } from "./source-type";

export interface Stream {
  name: string;
  topic: string;
  format: Format;
  type: SourceType.STREAM;
}
