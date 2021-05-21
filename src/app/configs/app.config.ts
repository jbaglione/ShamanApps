import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig: any = {
  endpoints: {
    // localhost
    security: 'http://localhost:65000/security/',
    apiShaman: 'http://localhost:65000/shaman/',
    apiPresupuestos: 'http://localhost:65000/presupuestos/',
    serial: "SERIAL-1234",
    // api: 'https://localhost:44319/api/',
    // oldExranet: 'http://localhost:2128/',

    // // test
    //  security: 'http://192.168.5.115:5005/security/',
    //  api: 'http://192.168.5.115:5006/api/',
    //  oldExranet: 'http://192.168.5.115:5000/'

    // QA
    // security: 'https://telmed.paramedicapps.com.ar/extranet-v2-security-test/security/',
    // api: 'https://telmed.paramedicapps.com.ar/extranet-v2-api-test/api/',
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

  urlWebHook: 'https://hooks.slack.com/services/',
  keyWebHook: 'TT0T9SN07/BT18GDRML/46yjXnY4HTkkv2urBebYIq4I',
  getApiURL: 'https://api.ipify.org?format=json',
  proxyCORSUrl: 'https://cors-anywhere.herokuapp.com/',


  version: '1.2.0-beta'
};
