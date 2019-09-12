import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { ListBitacorasComponent } from './bitacoras-list/bitacoras-list.component';
import { BitacoraDetailComponent } from './bitacora-detail/bitacora-detail.component';

const bitacorasRoutes: Routes = [
  {path: '', component: ListBitacorasComponent},
  {path: 'detail/:id', component: BitacoraDetailComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(bitacorasRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class BitacoraRoutingModule {
}
