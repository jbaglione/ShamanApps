import { NgModule } from '@angular/core';
import { NgxGalleryModule } from 'ngx-gallery';
import { SharedModule } from '@app/modules/shared/shared.module';
import { FacturacionRoutingModule } from './facturacion-routing.module';
import { ComprobantesComponent } from './pages/comprobantes/comprobantes.component';
import { ComprobanteServiciosComponent } from './pages/comprobante-servicios/comprobante-servicios.component';
import { ServicioRenglonComponent } from './pages/servicio-renglones/servicio-renglones.component';
import { FacturacionService } from './facturacion.service';


@NgModule({
  declarations: [ServicioRenglonComponent, ComprobantesComponent, ComprobanteServiciosComponent],
  imports: [
    SharedModule,
    FacturacionRoutingModule,
    NgxGalleryModule
  ],
  entryComponents: [ServicioRenglonComponent],
  exports: [
    ServicioRenglonComponent
  ],
  providers: [
    FacturacionService
  ],
})
export class FacturacionModule { }
