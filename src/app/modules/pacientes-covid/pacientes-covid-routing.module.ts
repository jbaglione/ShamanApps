import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PacientesCovidComponent } from './pages/pacientes-covid/pacientes-covid.component';

const operativaClientesRoutes: Routes = [
  {path: '', component: PacientesCovidComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(operativaClientesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PacientesCovidRoutingModule { }
