import { EMPTY, Observable } from 'rxjs';

import { InfoResponse } from "./api/info/info-response";
import { HealthcheckResponse } from "./api/healthcheck/healthcheck-response";

export class KsqlDBClient {

  public getInfo(): Observable<InfoResponse> {
    return EMPTY;
  }

  public getHealthcheck(): Observable<HealthcheckResponse> {
    return EMPTY;
  }
}
