import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogUploadComponent } from './dialog/dialog-upload.component';
import { UploadService } from './upload.service';

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

  @Output() emitirData: EventEmitter<any> = new EventEmitter();
  public data: string;
  public datos: string;

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

  // Originalmente, la idea era devolver la lista de archivos guardados.
  returnData(event) {
    this.data = 'OK';
    this.emitirData.emit(this.data);

  }

  constructor(public dialog: MatDialog, public uploadService: UploadService) {
    dialog.afterAllClosed
    .subscribe(() => {
      console.log('afterAllClosed');
    // update a variable or call a function when the dialog closes
      this.returnData(event);
    }
  );
  }

  public openUploadDialog() {
    const dialogRef = this.dialog.open(DialogUploadComponent ,
      { width: '50%',
      height: '50%',
      data: {
        entidad: this.entidad,
        idFirstEntidad: this.idFirstEntidad,
        idSecondEntidad: this.idSecondEntidad,
        currentNumberOfFiles: this.currentNumberOfFiles,
      }
    });

  }
}
