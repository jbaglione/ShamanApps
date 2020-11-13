import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { ConfiguracionComponent } from '../configuracion/pages/configuracion/configuracion.component';
import { LoginComponent } from './pages/login/login.component';

const securityRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'Login', component: LoginComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(securityRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class SecurityRoutingModule {
}
