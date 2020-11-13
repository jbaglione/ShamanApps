import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiquidacionesComponent } from './liquidaciones.component';

const LiquidacionesRoutes: Routes = [
  {path: ':modo', component: LiquidacionesComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(LiquidacionesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class LiquidacionesRoutingModule { }
