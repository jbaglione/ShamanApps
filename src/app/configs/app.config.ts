import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig: any = {
  endpoints: {
    // localhost
    // security: 'https://localhost:44377/security/',
    api: 'https://localhost:44319/api/',
    // oldExranet: 'http://localhost:2128/',

    // test
     security: 'http://192.168.5.115:5005/security/',
    //  api: 'http://192.168.5.115:5006/api/',
     oldExranet: 'http://192.168.5.115:5000/'

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
  // repositoryURL: 'https://github.com/ismaestro/angular6-example-app'
};

