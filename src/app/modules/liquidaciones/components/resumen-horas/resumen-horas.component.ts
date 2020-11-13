import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LiquidacionesService } from '../../liquidaciones.service';
import { ResumenItem } from '../../models/resumen-item.model';
import { ResumenHoras } from '../../models/resumen-horas.model';

@Component({
  selector: 'app-incidente-horas',
  templateUrl: './resumen-horas.component.html',
  styleUrls: ['./resumen-horas.component.css']
})

export class ResumenHorasComponent  {

  dcResumenHoras: string[] = [
    'abreviaturaId',
    'cumplimiento',
    'valor',
    'horas',
    'importe',
  ];
  resumenHoras: ResumenHoras[];
  resumenItem: ResumenItem;

  constructor(
    public dialogRef: MatDialogRef<ResumenHoras>,
    @Inject(MAT_DIALOG_DATA) public dialogData: ResumenHorasDialogData,
    private liquidacionesService: LiquidacionesService,
    public dialog: MatDialog,
  ) {
    this.resumenItem = this.dialogData.pResumenItem;
    if (this.resumenItem.link > 2) {
      this.dcResumenHoras.splice(1, 0, 'cantidad');
    }
    this.liquidacionesService
    .getResumenHoras(this.resumenItem.liquidacionMovilId)
    .subscribe(data => {
      this.resumenHoras = data;
      });
  }
}

export interface ResumenHorasDialogData {
  pResumenItem: ResumenItem;
  pItmLiq: string;
}
