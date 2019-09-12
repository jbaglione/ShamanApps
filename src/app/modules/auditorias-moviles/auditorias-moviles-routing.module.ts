import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuditoriasComponent } from './auditorias/auditorias-list/auditorias.component';
import { AuditoriaDetailComponent } from './auditorias/auditoria-detail/auditoria-detail.component';
import { AuditoriasMovilesComponent  } from './auditorias-moviles.component';
// import { ReclamosComponent  } from './reclamos/reclamos.component';
// import { ConsumosComponent } from './consumos/consumos.component';
// import { CuentaCorrienteComponent } from './cuenta.corriente/cuenta.corriente.component';

const AuditoriasMovilesRoutes: Routes = [
  // {path: 'consumos', component: ConsumosComponent},
  // {path: 'cuentacorriente', component: CuentaCorrienteComponent},
  {path: 'auditorias', component: AuditoriasComponent},
  {path: 'auditorias/detail/:id', component: AuditoriaDetailComponent},
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
