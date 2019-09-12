import { Component, Inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ClientesGestion } from 'src/app/models/clientes-gestion';
import { ActividadesClientesService } from '../../actividades-clientes.service';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { listable } from '../../../../models/listable.model';
import { ClienteAdjuntos } from 'src/app/models/clienteAdjuntos.model';

@Component({
  selector: 'app-gestion-detail',
  templateUrl: './gestion-detail.component.html',
  styleUrls: ['./gestion-detail.component.css']
})

export class GestionDetailComponent {

  idRegistracionSeleccionada = 0;
  gestion: ClientesGestion = new ClientesGestion();
  tiposGestion: listable;
  gestionForm: FormGroup;
  resultDialog: boolean;
  // Usar si quiero mostrar el nuevo numero antes.
  newGestionNro: number;

  @ViewChild('myInput', {static: false})
  myInputVariable: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<GestionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: GestionesDialogData,
    private gestionesService: ActividadesClientesService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.gestion.id = dialogData.id == 'nuevo' ? 0 : parseFloat(dialogData.id);
    this.gestion.clienteId = parseFloat(dialogData.clienteId);
    this.gestionesService.GetTiposGestion().subscribe(data => this.tiposGestion = data);

    this.gestionForm = new FormGroup({
      'fecha': new FormControl({ value: new Date(), disabled: false }, [Validators.required]),
      'tipoGestion': new FormControl({ value: '0', disabled: false }, [Validators.required]),
      'adjuntoArchivo': new FormControl({ value: null, disabled: this.gestion.id !== 0 }),
      'observaciones': new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]),
      'fechaRecontacto': new FormControl({ value: new Date(), disabled: false }),
    });

    // Nota: valido porque no se necesitan nuevas propiedades.
    if (dialogData.elemento != null) {
      this.gestion = JSON.parse(JSON.stringify(dialogData.elemento));
      this.loadGestion();
    } else if (this.gestion.id !== 0) {
      this.gestionesService.GetGestion(this.gestion.id).subscribe(data => {
        if (data != undefined) {
          this.gestion = data;
          this.loadGestion();
        } else {
          this.dialogRef.close('Error');
        }
      });
    }
  }

  reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = '';
    console.log(this.myInputVariable.nativeElement.files);
  }

  eliminarAdjuntoActual() {
    this.gestion.adjunto = new ClienteAdjuntos();
    this.gestionForm.patchValue({
      adjuntoArchivo: null
    });
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      if (event.target.files[0].type != 'application/pdf') {
        alert(event.target.files[0].name + ' no es un archivo pdf valido');
        event.target.files = null;
        this.reset();
        this.cd.markForCheck();
        return;
      }
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.gestionForm.patchValue({
          adjuntoArchivo: reader.result
        });
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  loadGestion() {
    if (this.gestion.fecha == null || this.gestion.tipoGestion == null || this.gestion.observaciones == null) {
      this.resultDialog = false;
      this.openDialog('Error Datos', 'Hubo un error en la carga de datos. ¿Desea abrir el registro igual?');
      // TODO: arreglar dialogo navegacion.
      // this.commonservices.showSnackBar('Error en los datos');
    }

    this.gestionForm.patchValue({
      fecha: this.gestion.fecha,
      tipoGestion: this.gestion.tipoGestion == null ? new listable('1', '') : this.gestion.tipoGestion.id,
      observaciones: this.gestion.observaciones,
      fechaRecontacto: this.gestion.fechaRecontacto,
      adjuntoArchivo: this.gestion.adjunto.archivo
    });
  }

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

  guardarGestion() {
    console.log(this.gestionForm.value);
    if (this.gestionForm.valid) {

      this.gestion.fecha = this.gestionForm.controls.fecha.value;
      this.gestion.tipoGestion = new listable(this.gestionForm.controls.tipoGestion.value, '');
      this.gestion.observaciones = this.gestionForm.controls.observaciones.value;
      this.gestion.fechaRecontacto = this.gestionForm.controls.fechaRecontacto.value;
      this.gestion.adjunto.archivo = this.gestionForm.controls.adjuntoArchivo.value;

      this.gestionesService.CreateClientesGestion(this.gestion).subscribe((newGestion) => {
        console.log(JSON.stringify(newGestion));
        if (newGestion != undefined) {
          this.dialogRef.close('updated');
        }
      });
    }
  }
}

export interface GestionesDialogData {
  id: string;
  clienteId: string;
  acceso: string;
  elemento: ClientesGestion;
}
