import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HisopadosComponent } from './pages/hisopados/hisopados.component';

const operativaClientesRoutes: Routes = [
  {path: '', component: HisopadosComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(operativaClientesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HisopadosRoutingModule { }
