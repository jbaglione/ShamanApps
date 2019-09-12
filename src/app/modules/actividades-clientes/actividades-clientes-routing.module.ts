import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { ConsumosComponent } from './consumos/consumos.component';
import { CuentaCorrienteComponent } from './cuenta.corriente/cuenta.corriente.component';
import { GestionesComponent } from './gestiones/gestiones-list/gestiones.component';
import { GestionDetailComponent } from './gestiones/gestion-detail/gestion-detail.component';
import { ReclamosComponent  } from './reclamos/reclamos.component';
import { ActividadesClientesComponent  } from './actividades-clientes.component';

const ActividadesClientesRoutes: Routes = [
  {path: 'consumos', component: ConsumosComponent},
  {path: 'cuentacorriente', component: CuentaCorrienteComponent},
  {path: 'gestiones', component: GestionesComponent},
  {path: 'gestiones/detail/:id', component: GestionDetailComponent},
  {path: 'reclamos', component: ReclamosComponent},
  {path: ':clienteId', component: ActividadesClientesComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(ActividadesClientesRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ActividadesClientesRoutingModule {
}
