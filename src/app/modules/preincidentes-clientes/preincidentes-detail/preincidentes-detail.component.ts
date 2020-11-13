import { Component, Inject, ChangeDetectorRef, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { BehaviorSubject, Observable } from 'rxjs';
import { Listable, ListableNumber } from '@app/models/listable.model';
import { PreIncidentesClientesService } from '../preincidentes-clientes.service';
import { DialogComponent } from '@app/modules/shared/dialog/dialog.component';
import { startWith, map } from 'rxjs/operators';
import { LocalidadItem } from '../models/localidadItem';
import { ValidatorsRanges } from '@app/modules/shared/helpers/validatorsRanges';
import { ClienteInfo } from '../../../models/clienteInfo';
import { PreIncidentesDialogData } from '../models/preIncidentesDialogData';
import { DireccionFormateada } from '../models/DireccionFormateada';
import { GoogleMapsCustomComponent } from '../google-map-custom/google-map-custom.component';
import { PreIncidentesServicios } from '../models/preIncidentesServicios';


@Component({
  selector: 'app-preincidentes-detail',
  templateUrl: './preincidentes-detail.component.html',
  styleUrls: ['./preincidentes-detail.component.css']
})

export class PreIncidentesDetailComponent implements OnInit {

  private cargandoDatos: BehaviorSubject<boolean>;
  public cargandoDatos$: Observable<boolean>;

  private cargandoDatosModelos: BehaviorSubject<boolean>;
  public cargandoDatosModelos$: Observable<boolean>;


  preincidentes: PreIncidentesServicios = new PreIncidentesServicios();
  userAcceso: string;
  tituloPopUp = 'Nuevo Servicio';
  sexos = ['F', 'M'];
  localidades: LocalidadItem[];
  grados: Listable[];
  iva: Listable[] = [new Listable('1', 'Exe'), new Listable('2', 'Grv')];
  // iva: ListableNumber[] = [new ListableNumber(1, 'Exe'), new ListableNumber(2, 'Grv')];
  planes: Listable[];
  //  = [
  //     {descripcion: 'Plan 1', id: '1'},
  //     {descripcion: 'Plan 2', id: '3'}
  // ];

  isLinear = false;
  preincidenteServicioFormGroup: FormGroup;

  defaultSelected = 0;
  selection: number;

  resultDialog: boolean;
  // Usar si quiero mostrar el nuevo numero antes.
  newPreIncidentesNro: number;
  actionClose = 'ok';
  clienteInfo: ClienteInfo;
  @ViewChild('myInput')
  myInputVariable: ElementRef;


  nroAfiliadoMask = [];

  constructor(
    public dialogRef: MatDialogRef<PreIncidentesDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: PreIncidentesDialogData,
    private preincidentesClientesService: PreIncidentesClientesService,
    public dialog: MatDialog
  ) {
    this.cargandoDatos = new BehaviorSubject<boolean>(true);
    this.cargandoDatos$ = this.cargandoDatos.asObservable();

    this.cargandoDatosModelos = new BehaviorSubject<boolean>(false);
    this.cargandoDatosModelos$ = this.cargandoDatosModelos.asObservable();

    this.preincidentes.id = dialogData.id === 'nuevo' ? 0 : parseFloat(dialogData.id);
    if (dialogData.id != 'nuevo') {
      this.tituloPopUp = 'Servicio Nº ' + dialogData.preincidente.nroServicio;
    }
    this.clienteInfo = dialogData.clienteInfo;

    this.userAcceso = dialogData.acceso;

    this.preincidenteServicioFormGroup = new FormGroup({
      fecha: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
      nroServicio: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 },
        [Validators.required, Validators.min(0), Validators.max(ValidatorsRanges.MAX_LONG)]), // nroRefCliente
      calle: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 },
        [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
      altura: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 },
        [Validators.required, Validators.min(0), Validators.max(ValidatorsRanges.MAX_INT)]),
      localidad: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.required]),
      // localidadId: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.required]),
      // localidadCodigo: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.required]),
      // localidadDesc: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.required]),
      longitud: new FormControl({ value: null, disabled: true }),
      latitud: new FormControl({ value: null, disabled: true }),
      codPostal: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }),
      // NO se pueden grabar
      provincia: new FormControl({ value: null, disabled: true }),
      partidoId: new FormControl({ value: null, disabled: true }),
      grabarCodigoPostal: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }),

      piso: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.max(ValidatorsRanges.MAX_INT)]),
      depto: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.maxLength(3)]),
      entreCalle1: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.maxLength(100)]),
      entreCalle2: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.maxLength(100)]),
      referencia: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.maxLength(200)]),

      nroAfiliado: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 },
        [Validators.required, Validators.minLength(3), Validators.maxLength(23)]),
      // Validators.pattern('^\\d\\d\\d\[A-Z]\\d$')]),
      sexo: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.required]),
      edad: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 },
        [Validators.required, Validators.min(0), Validators.max(130)]),
      sintoma: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 },
        [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
      grado: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.required]),
      nombre: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 },
        [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
      apellido: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 },
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      plan: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }),
      iva: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.required]),
      coPago: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 }, [Validators.required]),
      telefono: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 },
        [Validators.minLength(6), Validators.maxLength(14)]),
      // Validators.pattern('^((\\(?\\d{3}\\)? \\d{4})|(\\(?\\d{4}\\)? \\d{3})|(\\(?\\d{5}\\)? \\d{2}))\\d{4}$')]),
      observaciones: new FormControl({ value: null, disabled: this.preincidentes.id !== 0 },
        [Validators.maxLength(ValidatorsRanges.MAXLENG_NSTRING)]),
    });

    if (this.clienteInfo.validatorAfiliado) {
      this.preincidenteServicioFormGroup.get('nroAfiliado').setValidators(Validators.pattern(this.clienteInfo.validatorAfiliado));
    }
  }

  filteredPlanes: Observable<Listable[]>;

  ngOnInit(): void {



    this.preincidentesClientesService.GetLocalidades().subscribe(localidades => {
      this.localidades = localidades; this.cargandoDatos.next(false);
    });
    this.preincidentesClientesService.GetGradosOperativos().subscribe(data => this.grados = data);
    this.preincidentesClientesService.GetPlanes().subscribe(data => {
      this.planes = data;
      this.filteredPlanes = this.preincidenteServicioFormGroup.controls.plan.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : (value ? '' : value.descripcion)),
          map(descripcion => descripcion ? this._filterPlanes(descripcion) : this.planes.slice())
        );
    });
    if (this.preincidentes.id !== 0) {
      this.cargandoDatos.next(true);
      this.preincidentesClientesService.GetPreIncidente(this.preincidentes.id).subscribe(data => {
        this.cargandoDatos.next(false);
        if (data !== undefined) {
          this.preincidentes = data;
          this.loadPreIncidentes();
        } else {
          this.dialogRef.close('Error');
        }
      });
    } else {
      this.preincidenteServicioFormGroup.patchValue({
        fecha: new Date()
      });
    }
  }

  displayFnPlanes(plan: Listable): string {
    return plan && plan.descripcion ? plan.descripcion : '';
  }

  private _filterPlanes(descripcion: string): Listable[] {
    const filterValue = descripcion.toLowerCase();
    return this.planes.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) === 0);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  loadPreIncidentes() {
    if (this.preincidentes.fecha == null
      // ... || this.preincidentes.nombre == null
    ) {
      this.resultDialog = false;
      this.openDialog('Error Datos', 'Hubo un error en la carga de datos. ¿Desea abrir el registro igual?');
    }

    this.preincidenteServicioFormGroup.patchValue({
      fecha: this.preincidentes.fecha,
      nroServicio: this.preincidentes.nroServicio,
      piso: this.preincidentes.piso,
      depto: this.preincidentes.depto,
      entreCalle1: this.preincidentes.entreCalle1,
      entreCalle2: this.preincidentes.entreCalle2,
      referencia: this.preincidentes.referencia,

      nroAfiliado: this.preincidentes.nroAfiliado,
      sexo: this.preincidentes.sexo,
      edad: this.preincidentes.edad,
      sintoma: this.preincidentes.sintoma,
      grado: this.preincidentes.grado,
      nombre: this.preincidentes.nombre,
      apellido: this.preincidentes.apellido,
      plan: new Listable(this.preincidentes.plan, this.preincidentes.plan),
      iva: this.preincidentes.iva,
      coPago: this.preincidentes.coPago,
      telefono: this.preincidentes.telefono,
      observaciones: this.preincidentes.observaciones
      // ,condicion: this.preincidentes.condicion
      // movil: this.preincidentes.movil == null ? new listable('1', this.preincidentes.) : this.preincidentes.dominioId,
    });

    this.loadDireccionFormateada();
  }

  loadDireccionFormateada() {
    this.preincidenteServicioFormGroup.patchValue({
      calle: this.preincidentes.direccionFormateada.calle,
      altura: this.preincidentes.direccionFormateada.altura,
      localidad: this.preincidentes.direccionFormateada.localidad?.id,
      // localidadId: this.preincidentes.direccionFormateada.localidadId,
      // localidadCodigo: this.preincidentes.direccionFormateada.localidadCodigo,
      // localidadDesc: this.preincidentes.direccionFormateada.localidadDesc,
      longitud: this.preincidentes.direccionFormateada.longitud,
      latitud: this.preincidentes.direccionFormateada.latitud,
      codPostal: this.preincidentes.direccionFormateada.codPostal,
      // NO se pueden grabar
      provincia: this.preincidentes.direccionFormateada.provincia,
      partidoId: this.preincidentes.direccionFormateada.partidoId,
      grabarCodigoPostal: this.preincidentes.direccionFormateada.grabarCodigoPostal,
    });
  }
  openDialog(pTitle: string, pContent: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: pTitle, content: pContent }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resultDialog = result;
      // TODO: arreglar dialogo navegacion.
      if (!this.resultDialog) {
        this.dialogRef.close();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close(this.actionClose);
  }

  openMaps(): void {
    // this.markFormGroupTouched(this.preincidenteServicioFormGroup);
    this.GetDireccionFormateada();
    this.dialog.open(GoogleMapsCustomComponent, {
    // this.dialog.open(MapaComponent, {
      width: '90vw',
      maxWidth: '680px',
      data: this.preincidentes.direccionFormateada
    }).afterClosed().subscribe(result => {
      if (result != 'close' &&  result) {
        let direccion = result as DireccionFormateada;

        if ((this.preincidentes.direccionFormateada.calle ||
            this.preincidentes.direccionFormateada.altura ||
            this.preincidentes.direccionFormateada.localidad) &&
              (this.preincidentes.direccionFormateada.calle.toUpperCase() != direccion.calle.toUpperCase() ||
              this.preincidentes.direccionFormateada.altura !=  direccion.altura ||
              this.localidadEsDistinta(direccion))) {

                let msjObservaciones = 'EL MAPA ARROJO UNA DIRECCIÓN DISTINTA: ' +
                direccion.calle.toUpperCase() + ' ' + direccion.altura;
                if (direccion.localidad?.descripcion) {
                  msjObservaciones += ', ' + direccion.localidad.descripcion;
                }

              this.preincidenteServicioFormGroup.patchValue({
                observaciones: msjObservaciones});
                this.preincidentes.direccionFormateada.longitud = direccion.longitud;
                this.preincidentes.direccionFormateada.latitud = direccion.latitud;
        } else {
            this.preincidentes.direccionFormateada = direccion;
        }

        this.loadDireccionFormateada();
        this.preincidenteServicioFormGroup.controls.longitud.markAsDirty();
        this.preincidenteServicioFormGroup.controls.latitud.markAsDirty();
      }
    });

  }

  private localidadEsDistinta(direccion: DireccionFormateada): boolean {
    if (this.preincidentes.direccionFormateada.localidad && direccion.localidad) {
      return this.preincidentes.direccionFormateada.localidad.id != direccion.localidad.id;
    } else {
      if (!this.preincidentes.direccionFormateada.localidad && direccion.localidad) {
        return true;
      } else if (this.preincidentes.direccionFormateada.localidad && !direccion.localidad) {
        return true;
      } else {
        return false;
      }
    }
  }

  crearPreIncidentes() {
    console.log(this.preincidenteServicioFormGroup.value);
    if (this.preincidenteServicioFormGroup.valid) {

      this.preincidentes.fecha = this.preincidenteServicioFormGroup.controls.fecha.value;
      this.preincidentes.nroServicio = this.preincidenteServicioFormGroup.controls.nroServicio.value;
      this.GetDireccionFormateada();

      this.preincidentes.piso = this.getValueNumber(this.preincidenteServicioFormGroup.controls.piso.value);
      this.preincidentes.depto = this.getValueString(this.preincidenteServicioFormGroup.controls.depto.value);
      this.preincidentes.entreCalle1 = this.getValueString(this.preincidenteServicioFormGroup.controls.entreCalle1.value);
      this.preincidentes.entreCalle2 = this.getValueString(this.preincidenteServicioFormGroup.controls.entreCalle2.value);
      this.preincidentes.referencia = this.getValueString(this.preincidenteServicioFormGroup.controls.referencia.value);

      this.preincidentes.nroAfiliado = this.preincidenteServicioFormGroup.controls.nroAfiliado.value;
      this.preincidentes.sexo = this.preincidenteServicioFormGroup.controls.sexo.value;
      this.preincidentes.edad = this.preincidenteServicioFormGroup.controls.edad.value;
      this.preincidentes.sintoma = this.preincidenteServicioFormGroup.controls.sintoma.value;
      this.preincidentes.grado = this.grados.find(g => g.id == this.preincidenteServicioFormGroup.controls.grado.value).descripcion;
      this.preincidentes.nombre = this.preincidenteServicioFormGroup.controls.nombre.value;
      this.preincidentes.apellido = this.preincidenteServicioFormGroup.controls.apellido.value;
      this.preincidentes.plan = !this.preincidenteServicioFormGroup.controls.plan.value.id ?
        this.preincidenteServicioFormGroup.controls.plan.value :
        this.preincidenteServicioFormGroup.controls.plan.value.id;
      this.preincidentes.iva = this.preincidenteServicioFormGroup.controls.iva.value;
      this.preincidentes.coPago = this.preincidenteServicioFormGroup.controls.coPago.value;
      this.preincidentes.telefono = this.preincidenteServicioFormGroup.controls.telefono.value;
      this.preincidentes.observaciones = this.getValueString(this.preincidenteServicioFormGroup.controls.observaciones.value);

      this.preincidentesClientesService.GuardarPreIncidente(this.preincidentes).subscribe((newPreIncidentes) => {
        console.log(JSON.stringify(newPreIncidentes));
        if (newPreIncidentes !== undefined) {

          let accion = this.preincidentes.id == 0 ? 'registrado' : 'actualizado';

          this.preincidentes = newPreIncidentes as PreIncidentesServicios;
          this.preincidenteServicioFormGroup['disable']();

          this.dialog.open(DialogComponent, {
            width: '300px',
            data: {
              title: 'Información', content: 'Su servicio ha sido ' + accion + ' correctamente, en breves recibirá la aprobación o rechazo del mismo',
              yesText: 'OK', noText: ''
            }
          }).afterClosed().subscribe(resultDialog => {
            if (resultDialog) {
              this.actionClose = 'updated';
              this.dialogRef.close(this.actionClose);
            }
          });
        }
      });
    } else {
      this.markFormGroupTouched(this.preincidenteServicioFormGroup);
    }
  }
  private GetDireccionFormateada() {
    this.preincidentes.direccionFormateada = new DireccionFormateada();
    this.preincidentes.direccionFormateada.calle = this.preincidenteServicioFormGroup.controls.calle.value;
    this.preincidentes.direccionFormateada.altura = this.preincidenteServicioFormGroup.controls.altura.value;
    this.preincidentes.direccionFormateada.localidad =
      this.localidades.find(loc => loc.id == this.preincidenteServicioFormGroup.controls.localidad.value);
    this.preincidentes.direccionFormateada.longitud = this.getValueNumber(this.preincidenteServicioFormGroup.controls.longitud.value);
    this.preincidentes.direccionFormateada.latitud = this.getValueNumber(this.preincidenteServicioFormGroup.controls.latitud.value);
    this.preincidentes.direccionFormateada.codPostal = this.getValueString(this.preincidenteServicioFormGroup.controls.codPostal.value);
    // NO se pueden grabar = this.preincidenteServicioFormGroup.controls.// NO se pueden grabar.value;
    this.preincidentes.direccionFormateada.provincia = this.getValueString(this.preincidenteServicioFormGroup.controls.provincia.value);
    this.preincidentes.direccionFormateada.partidoId = this.getValueString(this.preincidenteServicioFormGroup.controls.partidoId.value);
    this.preincidentes.direccionFormateada.grabarCodigoPostal =
      this.getValueBolean(this.preincidenteServicioFormGroup.controls.grabarCodigoPostal.value);
  }

  getValueNumber(value: any): number {
    if (value) {
      return value;
    } else {
      return 0;
    }
  }
  getValueString(value: any): string {
    // if (value) {
    return value;
    // } else {
    //   return '';
    // }
  }
  getValueBolean(value: any): boolean {
    if (value) {
      return value;
    } else {
      return false;
    }
  }
}
