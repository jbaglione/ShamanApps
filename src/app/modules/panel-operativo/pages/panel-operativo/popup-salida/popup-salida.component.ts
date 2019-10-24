import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// import { FacturacionService } from '../../facturacion.service';
// import { ServicioRenglon } from '../../../models';

@Component({
  selector: 'app-popup-salida',
  templateUrl: './popup-salida.component.html',
  styleUrls: ['./popup-salida.component.css']
})

export class PopUpSalidaComponent {

  dcServicioRenglones: string[] = [
    'codigo',
    'concepto',
    'cantidad',
    'unitario',
    'importe'
  ];
  // dataSource: ServicioRenglon[];
  incidenteId: number;

  constructor(
    public dialogRef: MatDialogRef<PopUpSalidaComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: SalidaDialogData,
    // private facturacionService: FacturacionService,
    public dialog: MatDialog,
  ) {
    this.incidenteId = dialogData.incidenteId;
    // this.facturacionService.getRenglones(dialogData.comprobaneId,
    //   dialogData.servicioId).subscribe(data => this.dataSource = data);
  }
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }
}

export interface SalidaDialogData {
  incidenteId: number;
}
