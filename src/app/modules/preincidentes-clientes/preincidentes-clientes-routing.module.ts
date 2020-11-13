import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreIncidentesListComponent } from './preincidentes-list/preincidentes-list.component';
import { PreIncidentesDetailComponent } from './preincidentes-detail/preincidentes-detail.component';
import { GoogleMapsCustomComponent } from './google-map-custom/google-map-custom.component';

const PreIncidentesClientesRoutes: Routes = [
  { path: '', component: PreIncidentesListComponent },
  { path: '/:id', component: PreIncidentesDetailComponent },
  { path: '/google-map-custom', component: GoogleMapsCustomComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(PreIncidentesClientesRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class PreIncidentesClientesRoutingModule {
}
