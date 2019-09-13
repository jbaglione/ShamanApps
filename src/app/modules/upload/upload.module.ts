import { NgModule } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';
import { UploadComponent } from './upload.component';
import { UploadService } from './upload.service';
import { DialogUploadComponent } from './dialog/dialog-upload.component';

@NgModule({
  declarations: [UploadComponent, DialogUploadComponent],
  imports: [ SharedModule ],
  exports: [UploadComponent, DialogUploadComponent],
  providers: [UploadService],
  entryComponents: [DialogUploadComponent]
})
export class UploadModule {}
