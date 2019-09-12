import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ElectrosComponent } from './pages/electros/electros.component';

const operativaClientesRoutes: Routes = [
  {path: '', component: ElectrosComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(operativaClientesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class OperativaClientesRoutingModule { }
