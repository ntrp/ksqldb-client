export interface Query {
  queryString: string;
  sinks: string[];
  sinkKafkaTopics: string;
  id: string;
  statusCount: any;
  quaryType: string;
  state: string;
}
