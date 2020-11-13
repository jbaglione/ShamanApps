import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { RecetasService } from '../../services/recetas.service';
import { Medicamentos } from '../../models/medicamentos.model';
import { MedicamentosSearchComponent } from '../medicamentos-search/medicamentos-search.component';
import { MedicamentosDialogComponent } from '../medicamentos-dialog/medicamentos-dialog.component';

@Component({
  selector: 'app-medicamentos-list',
  templateUrl: './medicamentos-list.component.html',
  styleUrls: ['./medicamentos-list.component.css']
})

export class MedicamentosListComponent implements OnInit {

  @Input() medicamentos: Medicamentos[];
  @Input() recetaId = 0;

  private sort: MatSort;
  medicamentoForm: FormGroup;

  dcMedicamentos: string[] = ['nroRenglon', 'nombre', 'droga', 'presentacion', 'observaciones', 'cantidad', 'delete'];
  public mtMedicamentos = new MatTableDataSource();

  nroMedicamentoSeleccionado = 0;

  isLoading = false;

  resultDialog: boolean;
  eliminarClick: boolean;

  rowid = -1;
  highlightedRows: any[];

  editDisabled = false;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.mtMedicamentos.sort = this.sort;
  }
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    private recetasService: RecetasService,
    public dialog: MatDialog
  ) {
    this.newFormGroup();
  }

  private newFormGroup() {
    this.medicamentoForm = new FormGroup({
      'nroRenglon': new FormControl({ value: 0, disabled: true }, [Validators.required]),
      'nombre': new FormControl({ value: '', disabled: this.recetaId !== 0 && this.editDisabled },
        [Validators.required, Validators.minLength(3)]),
      'droga': new FormControl({ value: '', disabled: this.recetaId !== 0 && this.editDisabled },
        [Validators.required, Validators.minLength(3)]),
      'presentacion': new FormControl({ value: '', disabled: this.recetaId !== 0 && this.editDisabled },
        [Validators.required, Validators.minLength(3)]),
      'observaciones': new FormControl(''),
      'cantidad': new FormControl({ value: 0, disabled: this.recetaId !== 0 && this.editDisabled },
        [Validators.required, Validators.min(1)]),
      'abreviaturaId': new FormControl({ value: '', disabled: true }),
      'id': new FormControl({ value: '', disabled: true })
    });
  }

  ngOnInit() {
    this.loadMedicamentos();
  }

  selMedicamento(medicamento: Medicamentos) {
    if (this.eliminarClick) {
      this.eliminarClick = false;
      return;
    }
    this.highlightedRows = [];
    this.highlightedRows.push(medicamento);

    if (medicamento && medicamento.droga !== '') {
      this.medicamentoFormPatchValue(medicamento);
    }
  }

  loadMedicamentos() {
    if (this.medicamentos == null) {
      this.medicamentos = [];
    }
    this.mtMedicamentos.data = this.medicamentos;
    this.mtMedicamentos.sort = this.sort;
    this.cleanMedicamentoFormControls();
  }

  nombreChange() {
    if (this.medicamentoForm.controls.nombre.valid) {
      // const that = this;
      // that.isLoading = true;
      this.recetasService.GetMedicamentosByName(this.medicamentoForm.controls.nombre.value).subscribe(data => {
        // that.isLoading = false;
        if (data && data.length > 0) {
          const dialogRef = this.dialog.open(MedicamentosDialogComponent, {
            width: '850px',
            data: { medicamentos: data }
          });

          dialogRef.afterClosed().subscribe(result => {
            this.resultDialog = result;
            if (result) {
              this.medicamentoFormPatchValue(result);
              this.nuevoMedicamento();
              this.setControlsDisabled(false);
            }
          });
        }
      });
    }
  }

  modificarMedicamento() {
    this.setMedicineInList(true);
  }

  nuevoMedicamento() {
    this.setMedicineInList();
  }

  private setMedicineInList(isEdit = false) {
    if (this.medicamentoForm.valid) {
      let med = this.findMedicineInCurrentPrescription(isEdit);
      if (!med) {
        let medicamento = <Medicamentos>{};
        medicamento.nombre = this.medicamentoForm.controls.nombre.value?.trim().toUpperCase();
        medicamento.droga = this.medicamentoForm.controls.droga.value?.trim().toUpperCase();
        medicamento.presentacion = this.medicamentoForm.controls.presentacion.value?.trim().toUpperCase();
        medicamento.observaciones = this.medicamentoForm.controls.observaciones.value?.trim().toUpperCase();
        medicamento.cantidad = this.medicamentoForm.controls.cantidad.value;
        medicamento.abreviaturaId = this.medicamentoForm.controls.abreviaturaId.value;
        medicamento.id = this.parseIntLocal(this.medicamentoForm.controls.id.value);
        medicamento.flgNomenclado = 0;

        if (this.medicamentoForm.controls.nroRenglon.value == 0) {
          medicamento.nroRenglon = this.medicamentos.length + 1;
          this.medicamentos.push(medicamento);

        } else {
          medicamento.nroRenglon = this.medicamentoForm.controls.nroRenglon.value;
          this.medicamentos = this.medicamentos.map(function (medF) {
            if (medF.nroRenglon == medicamento.nroRenglon) {
              medF = medicamento;
            }
            return medF;
          });
        }

        this.mtMedicamentos.data = this.medicamentos;
        this.highlightedRows = [];
        this.medicamentoFormPatchValue(<Medicamentos>{});
      } else {
        this.selMedicamento(med);
      }
    }
  }

  findMedicineInCurrentPrescription(isEdit = false): Medicamentos {
    if (!isEdit) {
      let medMach = this.medicamentos.find(medicamento => medicamento.nombre.trim().toUpperCase() ==
        this.medicamentoForm.controls.nombre.value?.trim().toUpperCase());
      if (medMach) {
        const dialogRef = this.dialog.open(DialogComponent, {
          width: '250px',
          data: { title: 'Error', content: 'Ya existe este medicamento en su lista', yesText: 'Ok' }
        });
        return medMach;
      }
    }
    return null;
  }

  openSearch() {
    const dialogRef = this.dialog.open(MedicamentosSearchComponent, {
      width: '95vw',
      height: '95%',
      maxWidth: '95vw',
      panelClass: 'my-panel',
      data: { nroRenglon: this.medicamentoForm.controls.nroRenglon.value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.medicamentoFormPatchValue(result);
        this.nombreChange();
      }
    });
  }

  private medicamentoFormPatchValue(medicamento: Medicamentos) {

    if (!medicamento.nroRenglon) {
      medicamento.nroRenglon = 0;
    }

    this.medicamentoForm.patchValue({
      nroRenglon: medicamento.nroRenglon,
      nombre: medicamento.nombre,
      droga: medicamento.droga,
      presentacion: medicamento.presentacion,
      observaciones: medicamento.observaciones,
      cantidad: medicamento.cantidad,
      abreviaturaId: medicamento.abreviaturaId,
      id: medicamento.id
    });

    let controlsDisabled = false;
    if (medicamento.abreviaturaId) {
      controlsDisabled = true;
    }
    this.setControlsDisabled(controlsDisabled);
  }

  cleanMedicamentoFormControls() {
    this.highlightedRows = [];
    this.newFormGroup();
  }

  dialogEliminarMedicamento(med: Medicamentos) {
    this.eliminarClick = true;
    this.dialog.open(DialogComponent, {
      width: '300px',
      data: {
        title: 'Advertencia', content: '¿Desea eliminar ' + med.nombre + ' de la receta?',
        yesText: 'Eliminar', noText: 'Cancelar'
      }
    }).afterClosed().subscribe(resultDialog => {
      if (resultDialog) {
        this.eliminarMedicamento(med.nroRenglon);
      }
    });
  }

  private eliminarMedicamento(nroRenglon: number) {
    let newMedicamentos: Medicamentos[] = [];
    for (let index = 0; index < this.medicamentos.length; index++) {
      let medIndex = this.medicamentos[index];
      if (medIndex.nroRenglon != nroRenglon) {
        medIndex.nroRenglon = newMedicamentos.length + 1;
        newMedicamentos.push(medIndex);
      }
    }
    this.medicamentos = newMedicamentos;
    this.mtMedicamentos.data = this.medicamentos;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  setControlsDisabled(disabled = true) {
    (<any>Object).values(this.medicamentoForm.controls).forEach(control => {
      if (disabled) {
        control.disable();
      } else {
        control.enable();
      }
    });
    this.medicamentoForm.controls.cantidad.enable();
  }

  onMouseOver(element) {
    this.rowid = element.id;
  }

  parseIntLocal(value): number {
    let num = Number(value);
    if (typeof num === 'number' && !Number.isNaN(num)) {
      return num;
    } else {
      return 0;
    }
  }

}
