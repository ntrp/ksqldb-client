const { get, request } = require('http');
const http2 = require('http2');
const ndjson = require('ndjson');
import { InfoResponse } from "./api/info/info-response";
import { HealthcheckResponse } from "./api/healthcheck/healthcheck-response";
import { ClientHttp2Session, ClientHttp2Stream, Http2Session, Http2Stream } from 'http2';
import { KsqlRequest, SessionVariables, StreamsProperties } from './api/ksql/ksql-request';
import { KSQL_CONTENT_TYPE, KSQL_STREAM_CONTENT_TYPE } from './api/content-type';
import { StreamsResponse, StreamsResponseExtended } from "./api/ksql/streams-response";
import { TablesResponse, TablesResponseExtended } from "./api/ksql/tables-response";
import { QueryStreamRequest } from "./api/query-stream/query-stream-request";
import { log } from "console";
import { ResponseHeader } from "./api/query-stream/response-header";
import { Observable, Subject } from "rxjs";

export class KsqlDBClient {

  private session: ClientHttp2Session;

  constructor(private baseUrl: string) {
    this.session = http2.connect(baseUrl);
  }

  public async getInfo(): Promise<InfoResponse> {
    return this.getSingle('info');
  }

  public async getHealthcheck(): Promise<HealthcheckResponse> {
    return this.getSingle('healthcheck');
  }

  public async listStreams(props?: Omit<KsqlRequest, 'ksql'>): Promise<StreamsResponse> {
    return this.statement<StreamsResponse>('LIST STREAMS;', props).then(res => res[0]);
  }

  public async listStreamsExtended(props?: Omit<KsqlRequest, 'ksql'>): Promise<StreamsResponseExtended> {
    return this.statement<StreamsResponseExtended>('LIST STREAMS EXTENDED;', props).then(res => res[0]);
  }

  public async listTables(props?: Omit<KsqlRequest, 'ksql'>): Promise<TablesResponse> {
    return this.statement<TablesResponse>('LIST TABLES;', props).then(res => res[0]);
  }

  public async listTablesExtended(props?: Omit<KsqlRequest, 'ksql'>): Promise<TablesResponseExtended> {
    return this.statement<TablesResponseExtended>('LIST TABLES EXTENDED;', props).then(res => res[0]);
  }

  public async statement<T>(statement: string, props?: Omit<KsqlRequest, 'ksql'>): Promise<T[]> {
    return this.postSingle('ksql', {
      ...props,
      ksql: statement
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

  queryStream<T>(body: QueryStreamRequest): Observable<T> {
    const buffer = Buffer.from(JSON.stringify(body));
    const req = this.session.request({
      [http2.constants.HTTP2_HEADER_SCHEME]: "http",
      [http2.constants.HTTP2_HEADER_METHOD]: http2.constants.HTTP2_METHOD_POST,
      [http2.constants.HTTP2_HEADER_PATH]: `/query-stream`,
      "Content-Type": "application/json",
      "Content-Length": buffer.length,
    })
    req.write(buffer);
    req.end();

    let header: ResponseHeader;
    const subject = new Subject<T>();

    req
      .pipe(ndjson.parse())
      .on('data', (data: any) => {
        if (!header) {
          header = data;
        } else {
          const transform = header.columnNames.reduce((acc, curr, idx) => ({ ...acc, [curr]: data[idx] }), {}) as T;
          subject.next(transform);
        }
      })
      .on('error', (err: any) => {
        subject.error(err);
      })
      .on('end', () => {
        subject.complete();
      });

    return subject.asObservable();
  }

  public close() {
    this.session?.close();
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
        console.log(bodyRaw)
        resolve((bodyRaw ? JSON.parse(bodyRaw) : null) as T);
      });
      stream.on('error', (err: any) => {
        reject(err)
      })
    })
  }

}
