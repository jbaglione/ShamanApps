import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AfiliacionesService } from '../afiliaciones.service';
import { ClientePotencial } from 'src/app/models/cliente-potencial.model';
import { listable } from '@app/models/listable.model';
import { DialogComponent } from '@app/modules/shared/dialog/dialog.component';
import { CommonService } from '@app/services/common.service';

@Component({
  selector: 'app-dialog-potencial-exito',
  templateUrl: './dialog-potencial-exito.component.html',
  styleUrls: ['./dialog-potencial-exito.component.css']
})

export class PotencialExitoComponent {

  idClientePotencial = 0;
  clientePotencial: ClientePotencial;
  suspendido = true;
  motivosSuspension: listable[];
  potencialExitoForm: FormGroup;
  resultDialog: boolean;

  formatLabel(value: number | null) {
    if (value == 0) {
      this.suspendido = true;
      return 'Suspendido';
    } else { this.suspendido = false; }
    // if (value == 100 ) {
    //   return 'Listo para afiliar';
    // }
    return value + '%';
  }

  constructor(
    public dialogRef: MatDialogRef<PotencialExitoComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: PotencialExitoDialogData,
    private afiliacionesService: AfiliacionesService,
    public dialog: MatDialog
  ) {
    this.clientePotencial = JSON.parse(JSON.stringify(dialogData.elemento));


    if (this.clientePotencial.clienteId == null ||
      (this.clientePotencial.estado != 1  && this.clientePotencial.estado != 5)) { // || this.gestion.observaciones == null) {
      this.resultDialog = false;
      this.openDialog('Error de Datos', 'No se puede cambiar el potencial de exito.');
    }

    this.afiliacionesService.getMotivosSuspension().subscribe(data => this.motivosSuspension = data);

    let motivoSuspension = '';
    if(this.clientePotencial.motivoSuspension != null && this.clientePotencial.estado == 5){
      motivoSuspension = this.clientePotencial.motivoSuspension.id
    }

    this.potencialExitoForm = new FormGroup({
      'motivoSuspension': new FormControl({ value: motivoSuspension, disabled: false }, [Validators.required]) // ver en disabled
    });

  }

  // this.potencialExitoForm.patchValue({
  //   fecha: this.gestion.fecha,
  //   tipoGestion: this.gestion.tipoGestion == null ? new listable('1', '') : this.gestion.tipoGestion.id,
  //   observaciones: this.gestion.observaciones,
  //   fechaRecontacto: this.gestion.fechaRecontacto,
  //   adjuntoArchivo: this.gestion.adjunto.archivo
  // });

  openDialog(pTitle: string, pContent: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: pTitle, content: pContent }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.resultDialog = result;
      // TODO: arreglar dialogo navegacion.
      if (!this.resultDialog) {
        this.dialogRef.close();
      }
      console.log(this.resultDialog);
    });
  }

  onNoClick(): void {
    this.dialogRef.close('ok');
  }

  guardarPotencialExito() {
    console.log(this.potencialExitoForm.value);

    if ( this.clientePotencial.potencialExito == 0 &&
      this.potencialExitoForm.controls.motivoSuspension.value == '') {
      this.potencialExitoForm.controls.motivoSuspension.markAsTouched();
      return;
    }

    // if (this.potencialExitoForm.valid) {
      this.clientePotencial.motivoSuspension = new listable(this.potencialExitoForm.controls.motivoSuspension.value, '');

      this.afiliacionesService.guardarPotencialExito(this.clientePotencial).subscribe((clientePotencialUpdated: any) => {
        console.log(JSON.stringify(clientePotencialUpdated));
        if (clientePotencialUpdated != undefined) {
          this.dialogRef.close('updated');
        }
      });
    // }
  }

  // private markFormGroupTouched(formGroup: FormGroup) {
  //   (<any>Object).values(formGroup.controls).forEach(control => {
  //     control.markAsTouched();

  //     if (control.controls) {
  //       this.markFormGroupTouched(control);
  //     }
  //   });
  // }
}

export interface PotencialExitoDialogData {
  // idClientePotencial: string;
  // clienteId: string;
  // acceso: string;
  elemento: ClientePotencial;
}
