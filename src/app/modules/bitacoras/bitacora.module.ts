import { NgModule } from '@angular/core';
import { NgxGalleryModule } from 'ngx-gallery';
import { SharedModule } from '@app/modules/shared/shared.module';
import { UploadModule } from '@app/modules/upload/upload.module';
import { BitacoraDetailComponent } from './bitacora-detail/bitacora-detail.component';
import { ListBitacorasComponent } from './bitacoras-list/bitacoras-list.component';
import { BitacoraRoutingModule } from './bitacora-routing.module';
import { BitacorasService } from './bitacoras.service';

@NgModule({
  declarations: [BitacoraDetailComponent, ListBitacorasComponent],
  imports: [
    SharedModule,
    UploadModule,
    BitacoraRoutingModule,
    NgxGalleryModule,
  ],
  exports: [BitacoraDetailComponent, ListBitacorasComponent],
  providers: [BitacorasService]
})
export class BitacoraModule {}
