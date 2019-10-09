import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuditoriasComponent } from './auditorias/auditorias-list/auditorias.component';
import { AuditoriasMovilesComponent  } from './auditorias-moviles.component';
import { AuditoriaCabeceraComponent } from './auditorias/auditoria-cabecera/auditoria-cabecera.component';
// import { ReclamosComponent  } from './reclamos/reclamos.component';
// import { ConsumosComponent } from './consumos/consumos.component';
// import { CuentaCorrienteComponent } from './cuenta.corriente/cuenta.corriente.component';

const AuditoriasMovilesRoutes: Routes = [
  // {path: 'consumos', component: ConsumosComponent},
  // {path: 'cuentacorriente', component: CuentaCorrienteComponent},
  {path: '', component: AuditoriasComponent},
  {path: '/cabecera/:id', component: AuditoriaCabeceraComponent},
  // {path: 'reclamos', component: ReclamosComponent},
  {path: ':movilId', component: AuditoriasMovilesComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(AuditoriasMovilesRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AuditoriasMovilesRoutingModule {
}
