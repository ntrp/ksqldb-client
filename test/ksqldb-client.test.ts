import { KsqlDBClient } from '../src/ksqldb-client';

describe("ksqlDB Client", () => {

  let client: KsqlDBClient;

  beforeEach(() => {
    client = new KsqlDBClient("http://localhost:8088");
  })

  describe('Info endpoint', () => {

    it("should return the state of the cluster", (done) => {

      client.queryStream<any>({
        sql: 'SELECT * FROM pub_state_table WHERE station = \'hbw\';',
        streamsProperties: {
          'ksql.streams.auto.offset.reset': "earliest"
        }
      }).subscribe({
        next: d => console.log(JSON.stringify(d)),
        complete: () => {
          client.close();
          done();
        }
      });
    })
  })

})
