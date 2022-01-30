import { KsqlDBClient } from '../src/ksqldb-client';

describe("ksqlDB Client", () => {

  let client: KsqlDBClient;

  beforeEach(() => {
    client = new KsqlDBClient("http://localhost:8089");
  })

  describe('Info endpoint', () => {

    it("should return the state of the cluster", async () => {

      const res = await client.listStreamsExtended();
      console.log(JSON.stringify(res));

      expect(res).toBeTruthy();
    })
  })

})
