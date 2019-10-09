import { NgModule } from '@angular/core';
import { UploadModule } from '@app/modules/upload/upload.module';
import { SharedModule } from '@app/modules/shared/shared.module';
import { ActividadesClientesRoutingModule } from './actividades-clientes-routing.module';
import { ConsumosComponent } from './consumos/consumos.component';
import { CuentaCorrienteComponent } from './cuenta.corriente/cuenta.corriente.component';
import { GestionDetailComponent } from './gestiones/gestion-detail/gestion-detail.component';
import { GestionesComponent } from './gestiones/gestiones-list/gestiones.component';
import { ReclamosComponent } from './reclamos/reclamos.component';
import { ActividadesClientesComponent } from './actividades-clientes.component';
import { ActividadesClientesService } from './actividades-clientes.service';
import { IsEllipsisActiveDirective } from '@app/modules/shared/directives/is-ellipsis-active.directive';

@NgModule({
    declarations: [
      ConsumosComponent,
      CuentaCorrienteComponent,
      GestionesComponent,
      GestionDetailComponent,
      ReclamosComponent,
      ActividadesClientesComponent,
      IsEllipsisActiveDirective
    ],
    imports: [
      SharedModule,
      UploadModule,
      ActividadesClientesRoutingModule
    ],
    exports: [
      ConsumosComponent,
      CuentaCorrienteComponent,
      GestionesComponent,
      GestionDetailComponent,
      ReclamosComponent,
      ActividadesClientesComponent,
      IsEllipsisActiveDirective
    ],
    providers: [
      ActividadesClientesService
    ]
})
export class ActividadesClientesModule {
}
