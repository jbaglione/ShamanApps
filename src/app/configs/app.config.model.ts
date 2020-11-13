import { Listable } from '@app/models/listable.model';

export interface IAppConfig {
  endpoints: {
    api: string;
    apiShaman: string;
    security: string;
    oldExranet: string;
    gestionApi: string;
  };
  vademecums: Listable[];
  apiKey: string;
  snackBarDuration: number;
  urlWebHook: string;
  keyWebHook: string;
  getApiURL: string;
  proxyCORSUrl: string;
  version: string;
}
