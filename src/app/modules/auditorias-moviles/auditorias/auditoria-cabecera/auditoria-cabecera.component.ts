import { Component, Inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Auditoria } from '../../models/auditoria';
import { AuditoriasMovilesService } from '../../auditorias-moviles.service';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { listable } from '../../../../models/listable.model';
import { CommonService } from '@app/modules/shared/services/common.service';
import { AuditoriaListModelosComponent } from '../auditoria-list-modelos/auditoria-list-modelos.component';

@Component({
  selector: 'app-auditoria-cabecera',
  templateUrl: './auditoria-cabecera.component.html',
  styleUrls: ['./auditoria-cabecera.component.css']
})

export class AuditoriaCabeceraComponent {
  auditoria: Auditoria = new Auditoria();
  userAcceso: string;
  moviles: listable[];
  choferes: listable[];
  medicos: listable[];
  enfermeros: listable[];
  bases: listable[];
  prestadores: listable[];

  auditoriaForm: FormGroup;
  resultDialog: boolean;
  // Usar si quiero mostrar el nuevo numero antes.
  newAuditoriaNro: number;

  @ViewChild('myInput', {static: false})
  myInputVariable: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<AuditoriaCabeceraComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: AuditoriasDialogData,
    private auditoriasMovilesService: AuditoriasMovilesService,
    public dialog: MatDialog,
    private commonService: CommonService
  ) {
    this.auditoria.id = dialogData.id === 'nuevo' ? 0 : parseFloat(dialogData.id);
    this.userAcceso = dialogData.acceso;
    // this.auditoria.dominioId = parseFloat(dialogData.clienteId);
    this.auditoriasMovilesService.GetMoviles().subscribe(data => this.moviles = data);
    this.auditoriasMovilesService.GetChoferes().subscribe(data => this.choferes = data);
    this.auditoriasMovilesService.GetMedicos().subscribe(data => this.medicos = data);
    this.auditoriasMovilesService.GetEnfermeros().subscribe(data => this.enfermeros = data);
    this.auditoriasMovilesService.GetBasesOperativas().subscribe(data => this.bases = data);
    this.auditoriasMovilesService.GetPrestadores().subscribe(data => this.prestadores = data);

    this.auditoriaForm = new FormGroup({
      fecha: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
      movil: new FormControl({ value: null, disabled: this.auditoria.id !== 0 }, [Validators.required]),
      chofer: new FormControl({ value: null, disabled: this.auditoria.id !== 0 }),
      medico: new FormControl({ value: null, disabled: this.auditoria.id !== 0 }),
      enfermero: new FormControl({ value: null, disabled: this.auditoria.id !== 0 }),
      base: new FormControl({ value: null, disabled: this.auditoria.id !== 0 }),
      prestador: new FormControl({ value: null, disabled: this.auditoria.id !== 0 }),
      condicion: new FormControl({ value: null, disabled: true }) // Delete ?
    });

    // Nota: valido porque no se necesitan nuevas propiedades.
    if (dialogData.elemento != null) {
      this.auditoria = JSON.parse(JSON.stringify(dialogData.elemento));
      this.loadAuditoria();
    } else if (this.auditoria.id !== 0) {
      this.auditoriasMovilesService.GetAuditoria(this.auditoria.id).subscribe(data => {
        if (data !== undefined) {
          this.auditoria = data;
          this.loadAuditoria();
        } else {
          this.dialogRef.close('Error');
        }
      });
    }
  }

  loadAuditoria() {
    if (this.auditoria.fecha == null ||
        this.auditoria.chofer == null ||
        this.auditoria.medico == null ||
        this.auditoria.movil == null) {
      this.resultDialog = false;
      this.openDialog('Error Datos', 'Hubo un error en la carga de datos. ¿Desea abrir el registro igual?');
    }

    this.auditoriaForm.patchValue({
      fecha: this.auditoria.fecha,
      movil: this.auditoria.movil.id,
      chofer: this.auditoria.chofer.id,
      medico: this.auditoria.medico.id,
      enfermero: this.auditoria.enfermero.id,
      base: this.auditoria.base.id,
      prestador: this.auditoria.prestador.id,
      condicion: this.auditoria.condicion
      // movil: this.auditoria.movil == null ? new listable('1', this.auditoria.) : this.auditoria.dominioId,
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

  crearAuditoria() {
    console.log(this.auditoriaForm.value);
    if (this.auditoriaForm.valid) {

      this.auditoria.fecha = this.auditoriaForm.controls.fecha.value;
      this.auditoria.movil.id = this.auditoriaForm.controls.movil.value;
      this.auditoria.chofer.id = this.auditoriaForm.controls.chofer.value;
      this.auditoria.medico.id = this.auditoriaForm.controls.medico.value;
      this.auditoria.enfermero.id = this.auditoriaForm.controls.enfermero.value;
      this.auditoria.base.id = this.auditoriaForm.controls.base.value;
      this.auditoria.prestador.id = this.auditoriaForm.controls.prestador.value;
      this.auditoria.condicion = this.auditoriaForm.controls.condicion.value;

      this.auditoriasMovilesService.CreateAuditoria(this.auditoria).subscribe((newAuditoria) => {
        console.log(JSON.stringify(newAuditoria));
        if (newAuditoria !== undefined) {
          this.auditoria = newAuditoria as Auditoria;
          this.newAuditoriaNro = this.auditoria.id;
          this.dialogRef.close('updated');

          const dialogRefList = this.dialog.open(AuditoriaListModelosComponent, {
            width: '95vw',
            maxWidth: '700px',
            data: { auditoriaId: this.newAuditoriaNro, movilId: this.auditoria.movil, acceso: this.userAcceso }
          });

          dialogRefList.afterClosed().subscribe(result => {
            // if (result === 'updated') {
            //   this.LoadData();
            // }
          });
        }
      });
    }
  }
}

export interface AuditoriasDialogData {
  id: string;
  clienteId: string;
  acceso: string;
  elemento: Auditoria;
}
