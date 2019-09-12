import { NgModule } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';
import { MoliRoutingModule } from './moli-routing.module';
import { MoliComponent } from './moli.component';
import { MoliRealizadosComponent } from './pages/molirealizados/molirealizados.component';
import { MoliRechazadosComponent } from './pages/molirechazados/molirechazados.component';
import { MoliService } from './moli.service';

@NgModule({
  declarations: [MoliComponent, MoliRealizadosComponent, MoliRechazadosComponent],
  imports: [
    SharedModule,
    MoliRoutingModule,
  ],
  exports: [
    MoliComponent
  ],
  providers: [
    MoliService
  ],
})
export class MoliModule { }
