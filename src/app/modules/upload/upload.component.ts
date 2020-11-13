import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogUploadComponent } from './dialog/dialog-upload.component';
import { UploadService } from './upload.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
// implements OnInit
export class UploadComponent  {
  @Input() entidad: string;
  @Input() idFirstEntidad: string;
  @Input() idSecondEntidad: string;
  @Input() currentNumberOfFiles: number;
  @Input() disabledValue: boolean;

  @Output() emitirData: EventEmitter<any> = new EventEmitter();
  public data: string;
  isMobile = false;
  // visible: boolean = true;
  // @Output() close: EventEmitter<any> = new EventEmitter();
  // toggle() {
  //   this.visible = !this.visible;
  //   if (this.visible) {
  //     this.open.emit(null);
  //   } else {
  //     this.close.emit(null);
  //   }
  // }

  constructor(public dialog: MatDialog, public uploadService: UploadService, private deviceService: DeviceDetectorService) {
    this.isMobile = deviceService.isMobile();
  }

  public openUploadDialog() {
    const dialogRef = this.dialog.open(DialogUploadComponent,
      {
        width: this.isMobile ? '95%' : '50%',
        height: this.isMobile ? '75%' : '50%',
        data: {
          entidad: this.entidad,
          idFirstEntidad: this.idFirstEntidad,
          idSecondEntidad: this.idSecondEntidad,
          currentNumberOfFiles: this.currentNumberOfFiles,
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === '') {
        console.log('The user has cancelled the operation');
      } else {
        console.log('The user has confirmed the operation');
        this.data = result;
        this.emitirData.emit(this.data);
      }
    });
  }
}
