import { NgModule } from '@angular/core';
import { UploadModule } from '@app/modules/upload/upload.module';
import { SharedModule } from '@app/modules/shared/shared.module';
import { PreIncidentesClientesComponent } from './preincidentes-clientes.component';
import { PreIncidentesListComponent } from './preincidentes-list/preincidentes-list.component';
import { PreIncidentesDetailComponent } from './preincidentes-detail/preincidentes-detail.component';
import { PreIncidentesClientesRoutingModule } from './preincidentes-clientes-routing.module';
import { PreIncidentesClientesService } from './preincidentes-clientes.service';
import { TextMaskModule } from 'angular2-text-mask';
import { AppConfig } from '@app/configs/app.config';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsCustomComponent } from './google-map-custom/google-map-custom.component';

@NgModule({
    declarations: [
      PreIncidentesClientesComponent,
      PreIncidentesListComponent,
      PreIncidentesDetailComponent,
      GoogleMapsCustomComponent
    ],
    imports: [
      TextMaskModule,
      SharedModule,
      UploadModule,
      PreIncidentesClientesRoutingModule,
      GoogleMapsModule,
    ],
    exports: [
      PreIncidentesClientesComponent,
      PreIncidentesListComponent,
      PreIncidentesDetailComponent,
      GoogleMapsCustomComponent
    ],
    providers: [
      PreIncidentesClientesService
    ]
})
export class PreIncidentesClientesModule {
}
