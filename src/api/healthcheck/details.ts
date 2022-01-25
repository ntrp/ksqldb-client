import { Metastore } from "./metastore";
import { Kafka } from "./kafka";

export interface Details {
  metastore: Metastore;
  kafka: Kafka;
}
