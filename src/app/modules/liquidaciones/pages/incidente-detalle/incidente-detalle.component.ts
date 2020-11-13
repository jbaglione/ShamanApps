import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IncidenteDetalle } from '../../models/indidente-detalle.model';
import { LiquidacionesService } from '../../liquidaciones.service';

@Component({
  selector: 'app-incidente-detalle',
  templateUrl: './incidente-detalle.component.html',
  styleUrls: ['./incidente-detalle.component.css']
})

export class IncidenteDetalleComponent  {

  dcIncidenteDetalles: string[] = [
    'subConcepto',
    'importe'
  ];
  incidenteDetalle: IncidenteDetalle;

  constructor(
    public dialogRef: MatDialogRef<IncidenteDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DetalleIncidenteDialogData,
    private liquidacionesService: LiquidacionesService,
    public dialog: MatDialog,
  ) {
    this.liquidacionesService.getIncidenteDetalle(this.dialogData.pItmLiq, this.dialogData.pLiqId, this.dialogData.pInc).subscribe(data => {
      this.incidenteDetalle = data;
    });
  }
}

export interface DetalleIncidenteDialogData {
  pItmLiq: string;
  pLiqId: string;
  pInc: string;
}
