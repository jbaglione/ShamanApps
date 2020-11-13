import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Medicamentos } from '../../models/medicamentos.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface DialogData {
  medicamentos: Medicamentos[];
}

@Component({
  selector: 'app-medicamentos-dialog-component',
  templateUrl: './medicamentos-dialog.component.html',
  styleUrls: ['./medicamentos-dialog.component.css'],
})
export class MedicamentosDialogComponent {
  cantidadFormGroup: FormGroup;
  dcMedicamentos: string[] = ['abreviaturaId', 'nombre', 'droga', 'presentacion', 'observaciones'];

  mtMedicamentos: Medicamentos[];
  rowid = -1;
  highlightedRows: any[];

  constructor(
    public dialogRef: MatDialogRef<MedicamentosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.mtMedicamentos = data.medicamentos;
        this.selMedicamento(this.mtMedicamentos[0]);
        this.cantidadFormGroup = new FormGroup({
          'cantidad': new FormControl({ value: '' }, [Validators.required, Validators.min(1)])
        });
    }

  selMedicamento(medicamento: Medicamentos) {
    this.highlightedRows = [];
    this.highlightedRows.push(medicamento);
  }
  onMouseOver(element) {
    this.rowid = element.id;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  aceptar() {
    if (this.cantidadFormGroup.controls.cantidad.valid) {
      this.highlightedRows[0].cantidad = this.cantidadFormGroup.controls.cantidad.value;
      this.dialogRef.close(this.highlightedRows[0]);
    }
  }
}
