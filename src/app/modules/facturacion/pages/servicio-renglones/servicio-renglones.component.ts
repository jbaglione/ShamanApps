import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FacturacionService } from '../../facturacion.service';
import { ServicioRenglon } from '../../models';

@Component({
  selector: 'app-servicio-renglones',
  templateUrl: './servicio-renglones.component.html',
  styleUrls: ['./servicio-renglones.component.css']
})

export class ServicioRenglonComponent {

  dcServicioRenglones: string[] = [
    'codigo',
    'concepto',
    'cantidad',
    'unitario',
    'importe'
  ];
  dataSource: ServicioRenglon[];
  nroInterno: number;

  constructor(
    public dialogRef: MatDialogRef<ServicioRenglonComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: RenglonesDialogData,
    private facturacionService: FacturacionService,
    public dialog: MatDialog,
  ) {
    this.nroInterno = dialogData.nroInterno;
    this.facturacionService.getRenglones(dialogData.comprobaneId,
      dialogData.servicioId).subscribe(data => this.dataSource = data);
  }
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }
}

export interface RenglonesDialogData {
  comprobaneId: number;
  servicioId: number;
  nroInterno: number;
}
