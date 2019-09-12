import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadService } from '../upload.service';
import { forkJoin } from 'rxjs';

export interface DialogData {
  entidad: string;
  idFirstEntidad: string;
  idSecondEntidad: string;
  currentNumberOfFiles: number;
}

@Component({
  selector: 'app-dialog-upload',
  templateUrl: './dialog-upload.component.html',
  styleUrls: ['./dialog-upload.component.css']
})
export class DialogUploadComponent implements OnInit {
  @ViewChild('file', {static: false}) file;
  progress;
  canBeClosed = true;
  primaryButtonText = 'Subir';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  public files: Set<File> = new Set();
  constructor(public dialogRef: MatDialogRef<DialogUploadComponent>,
    public uploadService: UploadService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    uploadService.entidad = data.entidad;
    uploadService.idFirstEntidad = data.idFirstEntidad;
    uploadService.idSecondEntidad = data.idSecondEntidad;
    uploadService.currentNumberOfFiles = data.currentNumberOfFiles;
  }

  ngOnInit() {
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key))) {
        if (this.esImagen(files[key].type)) {
          this.files.add(files[key]);
        } else {
          console.log(files[key].name + ' no es una imagen valida');
          alert(files[key].name + ' no es una imagen valida');
        }
      }
    }
  }

  addFiles() {
    this.file.nativeElement.click();
  }

private esImagen(tipoArchivo:string):Boolean{
   return (tipoArchivo === '' || tipoArchivo === undefined)?false:tipoArchivo.startsWith('image');
}

  closeDialog() {
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.uploadService.upload(this.files);
    console.log(this.progress);
    for (const key in this.progress) {
      this.progress[key].progress.subscribe(val => console.log(val));

    }

    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    // The OK-button should have the text "Finish" now
    this.primaryButtonText = 'Finalizar';

    // The dialog should not be closed while uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    // Hide the cancel-button
    this.showCancelButton = false;

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      // ... the dialog can be closed again...
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;

      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
    });
  }
}
