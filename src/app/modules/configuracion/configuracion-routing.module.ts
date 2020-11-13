import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';

const bitacorasRoutes: Routes = [
  {path: '', component: ConfiguracionComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(bitacorasRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ConfiguracionRoutingModule {
}
