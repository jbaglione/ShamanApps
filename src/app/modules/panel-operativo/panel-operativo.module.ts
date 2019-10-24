import { NgModule } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';
import { NgxGalleryModule } from 'ngx-gallery';
import { PanelOperativoRoutingModule } from './panel-operativo-routing.module';
import { PanelOperativoService } from './panel-operativo.service';
import * as agGridAngular from 'ag-grid-angular';
import { CustomTooltip } from './components/custom.tooltip.component';
import { PopUpSalidaComponent } from './pages/panel-operativo/popup-salida/popup-salida.component';
import { PanelOperativoComponent } from './pages/panel-operativo/panel-operativo.component';

@NgModule({
  declarations: [PanelOperativoComponent, CustomTooltip, PopUpSalidaComponent],
  imports: [
    SharedModule,
    PanelOperativoRoutingModule,
    NgxGalleryModule,
    agGridAngular.AgGridModule.withComponents([CustomTooltip])
  ],
  entryComponents: [PopUpSalidaComponent],
  exports: [PanelOperativoComponent, PopUpSalidaComponent],
  providers: [PanelOperativoService],

})
export class PanelOperativoModule {}

