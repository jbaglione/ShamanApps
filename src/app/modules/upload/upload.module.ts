import { NgModule } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';
import { UploadComponent } from './upload.component';
import { UploadService } from './upload.service';
import { DialogUploadComponent } from './dialog/dialog-upload.component';
import { DeviceDetectorModule } from 'ngx-device-detector';

@NgModule({
  declarations: [UploadComponent, DialogUploadComponent],
  imports: [ SharedModule, DeviceDetectorModule.forRoot() ],
  exports: [UploadComponent, DialogUploadComponent],
  providers: [UploadService],
})
export class UploadModule {}
