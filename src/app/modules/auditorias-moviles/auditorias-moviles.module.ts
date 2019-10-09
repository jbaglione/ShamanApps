import { NgModule } from '@angular/core';
import { UploadModule } from '@app/modules/upload/upload.module';
import { SharedModule } from '@app/modules/shared/shared.module';

import { AuditoriasMovilesRoutingModule } from './auditorias-moviles-routing.module';
import { AuditoriasComponent } from './auditorias/auditorias-list/auditorias.component';
import { AuditoriaCabeceraComponent } from './auditorias/auditoria-cabecera/auditoria-cabecera.component';
import { AuditoriaListModelosComponent } from './auditorias/auditoria-list-modelos/auditoria-list-modelos.component';

import { AuditoriasMovilesComponent } from './auditorias-moviles.component';
import { AuditoriasMovilesService } from './auditorias-moviles.service';


@NgModule({
    declarations: [
      AuditoriasComponent,
      AuditoriaCabeceraComponent,
      AuditoriaListModelosComponent,
      AuditoriasMovilesComponent
    ],
    imports: [
      SharedModule,
      UploadModule,
      AuditoriasMovilesRoutingModule
    ],
    exports: [
      AuditoriasComponent,
      AuditoriaCabeceraComponent,
      AuditoriaListModelosComponent,
      AuditoriasMovilesComponent
    ],
    providers: [
      AuditoriasMovilesService
    ]
})
export class AuditoriasMovilesModule {
}
