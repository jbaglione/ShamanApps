import { NgModule } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { HisopadosRoutingModule } from './hisopados-routing.module';
import { HisopadosComponent } from './pages/hisopados/hisopados.component';
import { HisopadosService } from './hisopados.service';

@NgModule({
  declarations: [HisopadosComponent],
  imports: [
    SharedModule,
    HisopadosRoutingModule,
    NgxGalleryModule,
  ],
  exports: [HisopadosComponent],
  providers: [HisopadosService]
})
export class HisopadosModule {}

