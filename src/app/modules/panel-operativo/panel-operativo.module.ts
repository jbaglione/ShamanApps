import { NgModule } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';
import { NgxGalleryModule } from 'ngx-gallery';
import { PanelOperativoRoutingModule } from './panel-operativo-routing.module';
import { PanelOperativoComponent } from './pages/panel-operativo/panel-operativo.component';
import { PanelOperativoService } from './panel-operativo.service';
import * as agGridAngular from 'ag-grid-angular';

@NgModule({
  declarations: [PanelOperativoComponent],
  imports: [
    SharedModule,
    PanelOperativoRoutingModule,
    NgxGalleryModule,
    agGridAngular.AgGridModule.withComponents([])
  ],
  exports: [PanelOperativoComponent],
  providers: [PanelOperativoService]
})
export class PanelOperativoModule {}

