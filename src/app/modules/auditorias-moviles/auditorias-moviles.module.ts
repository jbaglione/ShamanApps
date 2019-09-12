import { NgModule } from '@angular/core';
import { UploadModule } from '@app/modules/upload/upload.module';
import { SharedModule } from '@app/modules/shared/shared.module';
import { AuditoriasMovilesRoutingModule } from './auditorias-moviles-routing.module';
import { AuditoriasComponent } from './auditorias/auditorias-list/auditorias.component';
import { AuditoriaDetailComponent } from './auditorias/auditoria-detail/auditoria-detail.component';
// import { ReclamosComponent } from './reclamos/reclamos.component';
// import { ConsumosComponent } from './consumos/consumos.component';
// import { CuentaCorrienteComponent } from './cuenta.corriente/cuenta.corriente.component';
import { AuditoriasMovilesComponent } from './auditorias-moviles.component';
import { AuditoriasMovilesService } from './auditorias-moviles.service';

@NgModule({
    declarations: [
      AuditoriasComponent,
      AuditoriaDetailComponent,
      // ReclamosComponent,
      // ConsumosComponent,
      // CuentaCorrienteComponent,
      AuditoriasMovilesComponent
    ],
    imports: [
      SharedModule,
      UploadModule,
      AuditoriasMovilesRoutingModule
    ],
    exports: [
      AuditoriasComponent,
      AuditoriaDetailComponent,
      // ConsumosComponent,
      // CuentaCorrienteComponent,
      // ReclamosComponent,
      AuditoriasMovilesComponent
    ],
    providers: [
      AuditoriasMovilesService
    ]
})
export class AuditoriasMovilesModule {
}
