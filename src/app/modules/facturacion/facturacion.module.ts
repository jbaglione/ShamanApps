import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxGalleryModule } from 'ngx-gallery';
import { SharedModule } from '@app/modules/shared/shared.module';
import { JwtInterceptor } from '@app/modules/security/helpers';
import { ErrorInterceptor } from '@app/modules/core/helpers/error.interceptor';
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
    FacturacionService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class FacturacionModule { }
