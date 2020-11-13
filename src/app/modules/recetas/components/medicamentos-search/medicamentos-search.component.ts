import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConfig } from '@app/configs/app.config';
import { Medicamentos } from '../../models/medicamentos.model';
import { Listable } from '@app/models/listable.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-medicamentos-search',
  templateUrl: './medicamentos-search.component.html',
  styleUrls: ['./medicamentos-search.component.css']
})

export class MedicamentosSearchComponent {
   @ViewChild('iframe') iframe: ElementRef;

  vedemecumSelect: FormControl;
  vademecums: Listable[] =  AppConfig.settings.vademecums;
  notFound: boolean;
  doc: Document;
  pastedText: string;
  medicamento = <Medicamentos>{};
  urlFinal: any;

  constructor(public dialogRef: MatDialogRef<MedicamentosSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MedicamentosSearchDialogData) {
    this.medicamento.nroRenglon = data.nroRenglon;
    this.vedemecumSelect =  new FormControl(this.vademecums[0]);
    this.urlFinal = this.vedemecumSelect.value.descripcion;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  vademecumChange(value: Listable): void {
    this.urlFinal = this.vedemecumSelect.value.descripcion;
  }


  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData; // || window.Clipboard.toString();
    this.pastedText = clipboardData.getData('text');
    let textSplit = this.pastedText.split('\n');

    if (this.vedemecumSelect.value.id == '1') {
      this.medicamento.nombre = textSplit[0].replace('\r', '').replace('®', '');
      this.medicamento.droga = this.GetDrogas(textSplit);
      this.medicamento.presentacion = this.GetPresentacion(textSplit);
      this.medicamento.observaciones = this.GetObservaciones(textSplit, this.medicamento);
    } else {
      this.medicamento.nombre = textSplit[0].split('PRODUCTO: ')[1].replace('\r', '');
      this.medicamento.droga = textSplit[4].split('MONODROGAS: ')[1].replace('\r', '');
      this.medicamento.presentacion = textSplit[2].split('PRESENTACION: ')[1].split(' - DISPOSICION DE TRAZABILIDAD:')[0];
    }

    if (this.medicamento.cantidad == undefined || this.medicamento.cantidad == 0) {
      this.medicamento.cantidad = 1;
    }

    this.dialogRef.close(this.medicamento);
  }
  GetObservaciones(textSplit: string[], med: Medicamentos): string {
    let observaciones = textSplit[2].replace(med.droga, '').replace(med.presentacion, '').replace('\r', '').replace('®', '').trim();
    observaciones = observaciones.startsWith('.') ? observaciones.replace('.', '') : observaciones;
    return observaciones;
  }
  GetPresentacion(textSplit: string[]): string {
    let presetacion = '';
    let indexPresentacion = textSplit.findIndex((x) => x.includes('Presentación.')) + 1;
    if (indexPresentacion > 0) {
      presetacion = textSplit[indexPresentacion].replace('\r', '');
    } else {
      let presFirsTextIndex = textSplit[2].lastIndexOf(textSplit[2].split('.')[4]);
      presetacion = textSplit[2].substr(presFirsTextIndex , textSplit[2].length - presFirsTextIndex);
    }
    return presetacion;
  }

  GetDrogas(textSplit: string[]): string {
    let indexFirsDroga = textSplit.findIndex((x) => x.includes('Principios Activos de')) + 1;
    let drogas = textSplit[indexFirsDroga].replace(' →\r', '');
    for (let index = indexFirsDroga + 1; index < textSplit.length; index++) {
      const element = textSplit[index];
      if (element.includes(' →\r')) {
        drogas += ', ' + element.replace(' →\r', '');
      } else {
        index = textSplit.length;
      }
    }
    return drogas;
  }

  onInput(content: string) {
    // alert(content);
  }

}

export interface MedicamentosSearchDialogData {
  nroRenglon: number;
  vademecum: Listable;
  estado: string;
}
