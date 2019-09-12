import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComprobantesComponent } from './pages/comprobantes/comprobantes.component';
import { ComprobanteServiciosComponent } from './pages/comprobante-servicios/comprobante-servicios.component';

const FacturacionRoutes: Routes = [
  { path: '', component: ComprobantesComponent },
  { path: 'servicios/:comprobanteId', component: ComprobanteServiciosComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(FacturacionRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class FacturacionRoutingModule { }
