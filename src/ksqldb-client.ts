import { InfoResponse } from "./api/info/info-response";
import { HealthcheckResponse } from "./api/healthcheck/healthcheck-response";
import { Http2Stream } from 'http2';
import { KsqlRequest, SessionVariables, StreamsProperties } from './api/ksql/ksql-request';
import { KSQL_CONTENT_TYPE } from './api/content-type';
import { StreamsResponse, StreamsResponseExtended } from "./api/ksql/streams-response";
import { TablesResponse, TablesResponseExtended } from "./api/ksql/tables-response";
const { get, request } = require('http2-client');

export class KsqlDBClient {

  constructor(private baseUrl: string) {
  }

  public getInfo(): Promise<InfoResponse> {
    return this.getSingle('/info');
  }

  public getHealthcheck(): Promise<HealthcheckResponse> {
    return this.getSingle('/healthcheck');
  }

  public listStreams(props?: Omit<KsqlRequest, 'ksql'>): Promise<StreamsResponse> {
    return this.postSingle('ksql', {
      ...props,
      ksql: `LIST STREAMS;`
    })
  }

  public listStreamsExtended(props?: Omit<KsqlRequest, 'ksql'>): Promise<StreamsResponseExtended> {
    return this.postSingle('ksql', {
      ...props,
      ksql: `LIST STREAMS EXTENDED;`
    })
  }

  public listTables(props?: Omit<KsqlRequest, 'ksql'>): Promise<TablesResponse> {
    return this.postSingle('ksql', {
      ...props,
      ksql: `LIST TABLES;`
    })
  }

  public listTablesExtended(props?: Omit<KsqlRequest, 'ksql'>): Promise<TablesResponseExtended> {
    return this.postSingle('ksql', {
      ...props,
      ksql: `LIST TABLES EXTENDED;`
    })
  }

  private getSingle<T>(path: string): Promise<T> {
    return new Promise((resolve, reject) => {
      get(`${this.baseUrl}/${path}`, (res: any) => {
        this.getBody<T>(res).then((data) => resolve(data)).catch((e) => reject(e));
      });
    })
  }

  private postSingle<T>(path: string, body: KsqlRequest): Promise<T> {
    const buffer = Buffer.from(JSON.stringify(body));
    return new Promise((resolve, reject) => {
      request(`${this.baseUrl}/${path}`, {
        method: 'post',
        headers: {
          'Accept': KSQL_CONTENT_TYPE,
          'Content-Type': 'application/json',
          'Content-Length': buffer.length
        }
      }, (res: any) => {
        this.getBody<T>(res).then((data) => resolve(data)).catch((e) => reject(e));
      })
        .end(buffer);
    })
  }

  private getBody<T>(stream: Http2Stream): Promise<T> {
    return new Promise((resolve, reject) => {
      let bodyRaw = '';
      stream.on('data', (chunk: string) => {
        bodyRaw += chunk;
      });
      stream.on('end', (chunk: string) => {
        if (chunk) {
          bodyRaw += chunk;
        }
        resolve((bodyRaw ? JSON.parse(bodyRaw) : null) as T);
      });
      stream.on('error', (err: any) => {
        reject(err)
      })
    })
  }

}
