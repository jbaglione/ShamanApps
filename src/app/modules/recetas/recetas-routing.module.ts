import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { ListRecetasComponent } from './pages/recetas-list/recetas-list.component';
import { RecetaDetailComponent } from './pages/receta-detail/receta-detail.component';
import { TextMaskModule } from 'angular2-text-mask';

const recetasRoutes: Routes = [
  {path: '', component: ListRecetasComponent},
  {path: 'detail/:id', component: RecetaDetailComponent},
];

@NgModule({
  imports: [
    TextMaskModule,
    RouterModule.forChild(recetasRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class RecetaRoutingModule {
}
