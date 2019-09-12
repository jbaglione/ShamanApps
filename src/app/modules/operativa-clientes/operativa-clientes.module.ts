import { NgModule } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';
import { NgxGalleryModule } from 'ngx-gallery';
import { OperativaClientesRoutingModule } from './operativa-clientes-routing.module';
import { ElectrosComponent } from './pages/electros/electros.component';
import { OperativaClientesService } from './operativa-clientes.service';

@NgModule({
  declarations: [ElectrosComponent],
  imports: [
    SharedModule,
    OperativaClientesRoutingModule,
    NgxGalleryModule,
  ],
  exports: [ElectrosComponent],
  providers: [OperativaClientesService]
})
export class OperativaClientesModule {}

