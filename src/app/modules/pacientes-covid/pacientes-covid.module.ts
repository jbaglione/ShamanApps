import { NgModule } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { PacientesCovidRoutingModule } from './pacientes-covid-routing.module';
import { PacientesCovidComponent } from './pages/pacientes-covid/pacientes-covid.component';
import { PacientesCovidService } from './pacientes-covid.service';

@NgModule({
  declarations: [PacientesCovidComponent],
  imports: [
    SharedModule,
    PacientesCovidRoutingModule,
    NgxGalleryModule,
  ],
  exports: [PacientesCovidComponent],
  providers: [PacientesCovidService]
})
export class PacientesCovidModule {}

