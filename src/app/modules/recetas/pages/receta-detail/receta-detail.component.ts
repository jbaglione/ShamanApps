import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RequireMatch } from '@app/modules/shared/helpers/RequireMatch';
import { MedicamentosListComponent } from '../../components/medicamentos-list/medicamentos-list.component';
import { ClientesIntegrantesSearchComponent } from '../../components/clientes-integrantes-search/clientes-integrantes-search.component';
import { ClientesIntegrantesService } from '../../services/clientes-integrantes.service';
import { Recetas } from '../../models/recetas.model';
import { Listable } from '@app/models/listable.model';
import { ClientesRecetas } from '../../models/clientes-recetas.model';
import { ClientesIntegrantes } from '../../models/clientes-integrantes.model';
import { RecetasService } from '../../services/recetas.service';
import { CommonService } from '@app/modules/shared/services/common.service';

import { DialogComponent } from '@app/modules/shared/dialog/dialog.component';
import { Medicamentos } from '../../models/medicamentos.model';
import { FileService } from '@app/modules/shared/services/files.service';
import { ProgressBarService } from '@app/modules/shared/services/progress-bar.service';

@Component({
  selector: 'app-receta-detail',
  templateUrl: './receta-detail.component.html',
  styleUrls: ['./receta-detail.component.css']
})

export class RecetaDetailComponent implements OnInit {

  editDisabled = false;

  private sort: MatSort;

  receta = <Recetas>{ id: 0 };
  recetaForm: FormGroup;

  planes: Listable[];

  isLoading = false;
  isSaving = false;

  resultDialog: boolean;
  rowid = -1;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  @ViewChild(MedicamentosListComponent)
  public medicamentosComponent: MedicamentosListComponent;

  filteredPlanes: Observable<Listable[]>;

  clientes: ClientesRecetas[];

  filteredClientes: Observable<ClientesRecetas[]>;
  clienteIntegrante: ClientesIntegrantes;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  constructor(
    private recetasService: RecetasService,
    private clientesIntegrantesService: ClientesIntegrantesService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _ngZone: NgZone,
    private fileService: FileService,
    private progressBarService: ProgressBarService
  ) {


     activatedRoute.params.subscribe(params => {
      this.receta.id = params['id'] === 'nuevo' ? 0 : parseFloat(params['id']);
      this.setIsLoading(true);
      this.recetasService.GetClientesRecetas().subscribe(data => {
        this.clientes = data;
        this.filteredClientes = this.recetaForm.controls.cliente.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : (value ? '' : value?.descripcion)),
            map(descripcion => descripcion ? this._filterClientes(descripcion) : this.clientes.slice())
          );
          this.setIsLoading(false);
      });

      this.recetaForm = new FormGroup({
        'nroReceta': new FormControl({ value: 0, disabled: true }),
        'cliente': new FormControl({ value: '', disabled: this.receta.id !== 0 && this.editDisabled }, [Validators.required, RequireMatch]),
        'fecha': new FormControl({ value: new Date(), disabled: this.receta.id !== 0 && this.editDisabled}, [Validators.required]),
        'plan': new FormControl({ value: '', disabled: true }, [Validators.required]),
        'nroAfiliado': new FormControl({ value: '', disabled: true }, [Validators.required]),
        'paciente': new FormControl({ value: '', disabled: this.receta.id !== 0 && this.editDisabled},
        [Validators.required, Validators.minLength(3)]),
        'email': new FormControl({ value: '', disabled: this.receta.id !== 0 && this.editDisabled},
        [Validators.required, Validators.email]),
        'diagnostico': new FormControl({ value: '', disabled: this.receta.id !== 0 && this.editDisabled},
        [Validators.required, Validators.minLength(3)]),
        'flgTratamientoProlongado': new FormControl({ value: 0, disabled: this.receta.id !== 0 && this.editDisabled}),
      });

      if (this.receta.clienteInfo && this.receta.clienteInfo.validatorAfiliado) {
        this.recetaForm.get('nroAfiliado').setValidators(Validators.pattern(this.receta.clienteInfo.validatorAfiliado));
      }
    });
  }
  setIsLoading(isLoading: boolean, info = '') {
    if (isLoading) {
      this.isLoading = true;
      this.progressBarService.activarProgressBar(info);
    } else {
      this.isLoading = false;
      this.progressBarService.desactivarProgressBar();
    }
  }

  ngOnInit() {
    if (this.receta.id !== 0) {
      const that = this;
      this.setIsLoading(true);
      this.recetasService.GetRecetaByID(this.receta.id).subscribe(data => {
        this.receta = data;
        this.loadReceta();
        this.setIsLoading(false);
      });
    } else {
      this.commonService.setTitulo('Nueva Receta');
    }
  }


  setCliente() {
    this.recetaForm.controls.nroAfiliado.setValue('');
    this.recetaForm.controls.nroAfiliado.disable();
    this.recetaForm.controls.plan.disable();
    this.recetaForm.controls.plan.setValue('');
    this.recetaForm.controls.paciente.setValue('');
    this.recetaForm.controls.email.setValue('');

    if (this.recetaForm.controls.cliente.valid) {
      this.setIsLoading(true);
      this.recetasService.GetPlanes(this.recetaForm.controls.cliente.value.id).subscribe(data => {
        this.setIsLoading(false);
        this.recetaForm.controls.nroAfiliado.enable();
        this.recetaForm.controls.plan.enable();
        this.planes = data;
        if (this.planes && this.planes.length > 0) {
          this.recetaForm.controls.plan.setValidators(RequireMatch);
        } else {
          this.recetaForm.controls.plan.clearValidators();
          this.recetaForm.controls.plan.setValidators(Validators.required);
        }
        this.filteredPlanes = this.recetaForm.controls.plan.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : (value ? '' : value?.descripcion)),
            map(descripcion => descripcion ? this._filterPlanes(descripcion) : this.planes.slice())
          );
      });
    }
  }

  nroAfiliadoChange(valueEvent: any) {
    if (this.recetaForm.controls.nroAfiliado.valid) {
      const that = this;
      this.setIsLoading(true, 'Obteniendo clientes integrantes');
      this.clientesIntegrantesService.GetClienteIntegranteByCliNroAfiliado(this.recetaForm.controls.cliente.value.id,
        this.recetaForm.controls.nroAfiliado.value).subscribe(data => {
          this.setIsLoading(false);
          this.SetClienteIntegrante(data);
        });
    }
  }

  nroAfiliadoKeyDown(valueEvent: any) {
    if (valueEvent.key === 'F2') {
      this.openSearchClientesIntegrantes();
    } else {
      this.clienteIntegrante = null;
    }
  }

  searchClienteByDescripcion(event: any) {
    if ((this.recetaForm.controls.cliente.value?.id == 0 || this.recetaForm.controls.cliente.value?.id == undefined)
      && this.recetaForm.controls.cliente.value) {
      let cliMach = this.clientes.find(cliente => cliente.clienteId.toLowerCase() ==
        this.recetaForm.controls.cliente.value.toLowerCase());
      this.recetaForm.controls.cliente.setValue(cliMach);
      this.setCliente();
    }
  }

  searchPlanByDescripcion(event: any) {
    if (this.planes.length > 0 && (this.recetaForm.controls.plan.value?.id == 0 || this.recetaForm.controls.plan.value?.id == undefined)
      && this.recetaForm.controls.plan.value) {
      let planMach = this.planes.find(plan => plan.descripcion.toLowerCase() ==
        this.recetaForm.controls.plan.value.toLowerCase());
      this.recetaForm.controls.plan.setValue(planMach);
    }
  }

  openSearchClientesIntegrantes() {
    if (this.recetaForm.controls.cliente.value && this.recetaForm.controls.cliente.value?.id > 0) {
      const dialogRef = this.dialog.open(ClientesIntegrantesSearchComponent, {
        width: '95vw',
        height: 'auto',
        maxWidth: '950px',
        maxHeight: '700px',
        panelClass: 'my-panel',
        data: {
          nroAfiliado: this.recetaForm.controls.nroAfiliado.value,
          paciente: this.recetaForm.controls.paciente.value,
          clienteId: this.recetaForm.controls.cliente.value.id
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.SetClienteIntegrante(result);
        }
      });
    } else {
      this.dialog.open(DialogComponent, {
        width: '250px',
        data: { title: 'Advertencia', content: 'Seleccione el cliente antes de buscar un integrante', yesText: 'Ok' }
      });
    }
  }


  private SetClienteIntegrante(result: ClientesIntegrantes) {
    this.clienteIntegrante = result;

    if (this.clienteIntegrante && this.clienteIntegrante.id) {
      this.recetaForm.controls.nroAfiliado.setValue(this.clienteIntegrante.nroAfiliado);
      this.recetaForm.controls.paciente.setValue(this.clienteIntegrante.paciente);
      this.recetaForm.controls.email.setValue(this.clienteIntegrante.email);

      if (this.planes && this.planes.length > 0 && this.clienteIntegrante.planId) {
        let plan = this.planes.find(x => x.id == this.clienteIntegrante.planId);
        this.recetaForm.controls.plan.setValue(plan);
      }
    } else {
      this.recetaForm.controls.nroAfiliado.setValue(null);
      this.recetaForm.controls.paciente.setValue('');
      this.recetaForm.controls.email.setValue('');
    }
  }

  displayFnPlanes(plan: Listable): string {
    return plan && plan.descripcion ? plan.descripcion : '';
  }
  displayFnClientes(cliente: ClientesRecetas): string {
    return cliente && cliente.clienteId ? cliente.clienteId : '';
  }

  private _filterClientes(clienteId: string): ClientesRecetas[] {
    const filterValue = clienteId.toLowerCase();
    return this.clientes.filter(cliente => cliente.clienteId.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterPlanes(descripcion: string): Listable[] {
    const filterValue = descripcion.toLowerCase();
    return this.planes.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) === 0);
  }

  loadReceta() {

    if (this.receta.cliente == null || this.receta.nroAfiliado == null || JSON.stringify(this.receta.medicamentos) === '[]') {
      this.resultDialog = false;
      this.openDialogError('Error Datos', 'Hubo un error en la carga de datos. ¿Desea abrir el registro igual?');
      return;
    }

    this.medicamentosComponent.medicamentos = this.receta.medicamentos; // revisar
    this.medicamentosComponent.loadMedicamentos();

    this.recetaForm.patchValue({
      id: this.receta.id,
      nroReceta: this.receta.nroReceta,
      cliente: this.receta.cliente,
      fecha: this.receta.fecReceta,
      nroAfiliado: this.receta.nroAfiliado,
      plan: this.receta.plan == null ? new Listable('1', '') : this.receta.plan,
      paciente: this.receta.nombre,
      email: this.receta.email,
      diagnostico: this.receta.diagnostico,
      flgTratamientoProlongado: this.receta.flgTratamientoProlongado,
    });

    if (this.recetaForm.controls.cliente.valid) {
      this.recetaForm.controls.nroAfiliado.enable();
      this.recetaForm.controls.plan.enable();
    }
    this.commonService.setTitulo('Receta ' + this.receta.nroReceta);
  }

  openDialogError(pTitle: string, pContent: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: pTitle, content: pContent, noText: 'No', yesText: 'Si' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resultDialog = result;
      if (!this.resultDialog) {
        this.router.navigate(['/recetas']);
      }
    });
  }

  async backPage() {
    if (this.receta.id === 0) {
      if (await this.dialog.open(DialogComponent, {
        width: '300px', data: {
          title: 'Advertencia', content: 'No ha guardado la receta, perdera todos los cambios ¿Desea salir de todos modos? ',
          yesText: 'Salir', noText: 'Seguir editando'
        }
      }).afterClosed().toPromise()) {
        this.router.navigate(['/recetas']);
      }
    } else {
      this.router.navigate(['/recetas']);
    }
  }

  guardarReceta() {

    this.receta.medicamentos = this.medicamentosComponent.mtMedicamentos.data as Medicamentos[];
    if (this.recetaFormValidCustom()) {
      this.receta.cliente = this.recetaForm.controls.cliente.value;
      this.receta.fecReceta = this.recetaForm.controls.fecha.value;
      this.receta.nroAfiliado = this.recetaForm.controls.nroAfiliado.value;
      this.receta.plan = !this.recetaForm.controls.plan.value.id ?
        new Listable(this.recetaForm.controls.plan.value, this.recetaForm.controls.plan.value) : this.recetaForm.controls.plan.value;
      this.receta.nombre = this.recetaForm.controls.paciente.value?.trim().toUpperCase();
      this.receta.email = this.recetaForm.controls.email.value?.trim().toLowerCase();
      this.receta.diagnostico = this.recetaForm.controls.diagnostico.value?.trim().toUpperCase();
      this.receta.flgTratamientoProlongado = this.recetaForm.controls.flgTratamientoProlongado.value;

      this.isSaving = true;
      this.recetasService.GuardarRecetaV2(this.receta).subscribe((newReceta) => {
        this.isSaving = false;
        if (newReceta && newReceta.id) {
          this.receta = newReceta;
        }
        this.loadReceta();
      });
    } else {
      this.isSaving = false;
    }
  }

  generearRecetaPdf() {
    this.setIsLoading(true);
    this.recetasService.GenerearRecetaPdf(this.receta.id).subscribe((data) => {
      this.setIsLoading(false);
      if (data !== undefined) {
        // const file = new Blob([data], { type: 'application/pdf' });
        // const fileURL = URL.createObjectURL(file);
        // window.open(fileURL, '_blank');
        this.fileService.saveBuffer(data, 'receta', FileService.PDF_TYPE);
      }
    });
  }

  sendRecetaPdf() {
    this.setIsLoading(true);
    this.recetasService.SendPrescriptionTo(this.receta.id, this.receta.email).subscribe((data) => {
      if (data) {
        this.commonService.showSnackBarSucces('La receta fue enviada por email correctamente');
      }
      this.setIsLoading(false);
    });
  }

  recetaFormValidCustom(): boolean {
    return true;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onMouseOver(element) {
    this.rowid = element.id;
  }

}
