import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { LoginComponent } from "@app/modules/security/pages/login";

const securityRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'Login', component: LoginComponent},
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