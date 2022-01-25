import { Details } from "./details";

export interface HealthcheckResponse {
  isHealthy: boolean;
  details: Details;
}
