import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelOperativoComponent } from './pages/panel-operativo/panel-operativo.component';

const operativaClientesRoutes: Routes = [
  {path: '', component: PanelOperativoComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(operativaClientesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PanelOperativoRoutingModule { }
