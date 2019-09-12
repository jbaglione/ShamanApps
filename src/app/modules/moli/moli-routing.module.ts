import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoliComponent } from './moli.component';

const MoliRoutes: Routes = [
  {path: '', component: MoliComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(MoliRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MoliRoutingModule { }
