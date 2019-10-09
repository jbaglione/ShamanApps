import { Component, Inject, ChangeDetectorRef, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Auditoria } from '../../models/auditoria';
import { AuditoriasMovilesService } from '../../auditorias-moviles.service';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { listable } from '../../../../models/listable.model';
import { Observable } from 'rxjs';
import { CommonService } from '@app/modules/shared/services/common.service';
import { AuditoriaCabeceraComponent } from '../auditoria-cabecera/auditoria-cabecera.component';

@Component({
  selector: 'app-auditoria-list-modelos',
  templateUrl: './auditoria-list-modelos.component.html',
  styleUrls: ['./auditoria-list-modelos.component.css']
})

export class AuditoriaListModelosComponent {

  modelosAuditoria: listable[];

  modelosAuditoriaForm: FormGroup;
  resultDialog: boolean;
  // Usar si quiero mostrar el nuevo numero antes.
  auditoriaId: number;
  movilId: string;

  @ViewChild('myInput', {static: false})
  myInputVariable: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<AuditoriaCabeceraComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: AuditoriasModelosDialogData,
    private auditoriasMovilesService: AuditoriasMovilesService,
    public dialog: MatDialog,
    private commonService: CommonService
  ) {
    this.auditoriaId = parseFloat(dialogData.auditoriaId);
    this.movilId = dialogData.movilId;

    this.auditoriasMovilesService.GetTiposAuditoria(this.movilId)
    .subscribe(data => {
      this.modelosAuditoria = data;
      if (data != null && data.length > 0) {
        this.modelosAuditoriaForm.controls.modelosAuditoria.enable();
      } else {
        this.modelosAuditoriaForm.controls.modelosAuditoria.disable();
        this.commonService.showSnackBarFatal('Este movil no tiene cargado modelos de auditoria.');
      }
    });

    this.modelosAuditoriaForm = new FormGroup({
      modelosAuditoria: new FormControl({ value: null, disabled: true })
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

  iniciarModeloAuditoria(modeloId) {
    console.log(modeloId);
  }
}

export interface AuditoriasModelosDialogData {
  auditoriaId: string;
  movilId: string;
  acceso: string;
}
