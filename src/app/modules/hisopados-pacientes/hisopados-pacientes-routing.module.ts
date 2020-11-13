import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HisopadosPacientesComponent } from './pages/hisopados-pacientes/hisopados-pacientes.component';

const operativaClientesRoutes: Routes = [
  {path: '', component: HisopadosPacientesComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(operativaClientesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HisopadosPacientesRoutingModule { }
