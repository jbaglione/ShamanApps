import { NgModule } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { HisopadosPacientesRoutingModule } from './hisopados-pacientes-routing.module';
import { HisopadosPacientesComponent } from './pages/hisopados-pacientes/hisopados-pacientes.component';
import { HisopadosPacientesService } from './hisopados-pacientes.service';

@NgModule({
  declarations: [HisopadosPacientesComponent],
  imports: [
    SharedModule,
    HisopadosPacientesRoutingModule,
    NgxGalleryModule,
  ],
  exports: [HisopadosPacientesComponent],
  providers: [HisopadosPacientesService]
})
export class HisopadosPacientesModule {}

