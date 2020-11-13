import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LiquidacionesService } from '../../liquidaciones.service';
import { ResumenItemDetalle } from '../../models/resumen-item-detalle.model';
import { ResumenItem } from '../../models/resumen-item.model';

@Component({
  selector: 'app-resumen-detalle',
  templateUrl: './resumen-detalle.component.html',
  styleUrls: ['./resumen-detalle.component.css']
})

export class ResumenDetalleComponent  {

  dcResumenDetalle: string[] = [
    'descripcion',
    'importe'
  ];
  resumenDetalle: ResumenItemDetalle[];
  resumenItem: ResumenItem;

  constructor(
    public dialogRef: MatDialogRef<ResumenItemDetalle>,
    @Inject(MAT_DIALOG_DATA) public dialogData: ResumenDetalleDialogData,
    private liquidacionesService: LiquidacionesService,
    public dialog: MatDialog,
  ) {
    this.resumenItem = this.dialogData.pResumenItem;
    if (this.resumenItem.link > 2) {
      this.dcResumenDetalle.splice(1, 0, 'cantidad');
    }
    this.liquidacionesService
    .getResumenDetalle(this.dialogData.pItmLiq, this.resumenItem.liquidacionMovilId, this.resumenItem.link)
    .subscribe(data => {
      this.resumenDetalle = data;
      });
  }
}

export interface ResumenDetalleDialogData {
  pResumenItem: ResumenItem;
  pItmLiq: string;
}
