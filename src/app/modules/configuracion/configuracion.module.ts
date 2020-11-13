import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';



@NgModule({
  declarations: [
    ConfiguracionComponent,
    ChangePasswordComponent
  ],
  imports: [
    SharedModule,
    ConfiguracionRoutingModule
  ]
})
export class ConfiguracionModule { }
