import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig: any = {
  endpoints: {
    // localhost
    // security: 'https://localhost:44377/security/',
    // api: 'https://localhost:44319/api/',
    // oldExranet: 'http://localhost:2128/',

    // // test
    //  security: 'http://192.168.5.115:5005/security/',
    //  api: 'http://192.168.5.115:5006/api/',
    //  oldExranet: 'http://192.168.5.115:5000/'

    // QA
    security: 'https://telmed.paramedicapps.com.ar/extranet-v2-security-test/security/',
    api: 'https://telmed.paramedicapps.com.ar/extranet-v2-api-test/api/',
    oldExranet: 'https://telmed.paramedicapps.com.ar/old-version-test/'

    // Produccion
    // site: http://paramedicapps.com.ar:5567/'
    // api: 'http://paramedicapps.com.ar:5566/api/',
    // security: 'http://paramedicapps.com.ar:5568/security/',
    // oldExranet: 'http://paramedicapps.com.ar:58885/'

    // Server Local Pilar
    // api: 'http://192.168.5.95:5566/api/',
  },
  // votesLimit: 3,
  // topHeroesLimit: 4,
  snackBarDuration: 3700,
  loggingWebHook: 'https://hooks.slack.com/services/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',
  getApiURL: 'https://api.ipify.org?format=json',
  proxyCORSUrl: 'https://cors-anywhere.herokuapp.com/',
  version: '2.2.0-beta'
};
