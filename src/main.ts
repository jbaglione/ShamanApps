import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// import { defineCustomElements } from '@ionic/pwa-elements/loader';

// import 'hammerjs';
// import { LicenseManager } from 'ag-grid-enterprise';


// tslint:disable-next-line: max-line-length
// LicenseManager.setLicenseKey('Evaluation_License_Not_For_Production_16_December_2019__MTU3NjQ1NDQwMDAwMA==b4a8074d5060c37167e7bcb36abee4e1');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// // Call the element loader after the platform has been bootstrapped
// defineCustomElements(window);
