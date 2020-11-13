import { Component, Inject, ViewChild, OnInit, LOCALE_ID } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LiquidacionesService } from '../../liquidaciones.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Conformidad } from '../../models/conformidad.model';
import { DialogComponent } from '@app/modules/shared/dialog/dialog.component';
import { MotivoReclamo } from '../../models/motivo-reclamo.model';
import { AuthenticationService } from '@app/modules/security/authentication.service';
import { Incidentes } from '../../models';
import { CommonService } from '@app/modules/shared/services/common.service';
import { DateHelper } from '@app/modules/shared/helpers/DateHelper';

@Component({
  selector: 'app-revisar-presentacion',
  templateUrl: './revisar-presentacion.component.html',
  styleUrls: ['./revisar-presentacion.component.css']
})

export class RevisarPresentacionComponent implements OnInit {

  conformidad: Conformidad;
  conformidadForm: FormGroup;
  resultDialog: boolean;
  motivos: MotivoReclamo[];
  titulo: string;
  userAcceso: number;
  conforimdadEstado: number; // like revisar.conformidad
  row: Incidentes;
  controls: any;
  calculando: boolean;
  esEmpresa: boolean;

  constructor(
    public dialogRef: MatDialogRef<RevisarPresentacionComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: RevisarPresentacionDialogData,
    private liquidacionesService: LiquidacionesService,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private commonService: CommonService
  ) {
    this.row = this.dialogData.element;
    this.esEmpresa = this.dialogData.esEmpresa;
    this.titulo = 'Conformidad con incidente: ' + this.row.nroIncidente + ' (' + this.row.fecIncidente + ')';
    this.userAcceso = parseInt(this.authenticationService.currentAcceso.toString());

    this.conformidadForm = new FormGroup({
      fecIncidente: new FormControl(),
      nroIncidente: new FormControl(),
      conformidadId: new FormControl(),
      flgConforme: new FormControl(),
      motivoSeleccionado: new FormControl(),
      importe: new FormControl(),
      virImpLiquidado: new FormControl({disabled: true}),
      virImpDiferencia: new FormControl(),
      observaciones: new FormControl('', [Validators.maxLength(260)]),
      respuesta: new FormControl('', [Validators.maxLength(260)]),
      cerrado: new FormControl(),
      flgRespuesta: new FormControl()
    });

    this.controls = this.conformidadForm.controls;
  }

  ngOnInit(): void {
    if (this.row.id !== '') {
      this.liquidacionesService.getMotivosReclamos().subscribe(motivos => {
        this.motivos = motivos;
        this.liquidacionesService.getConformidad(this.row.id).subscribe(data => {
          if (data != undefined) {
            this.conformidad = data;
            this.loadConformidad();
          } else {
            this.dialogRef.close('Error');
          }
        });
      });
    }
  }

  loadConformidad() {
    if (this.conformidad.fecIncidente == null || this.conformidad.nroIncidente == null || this.conformidad.conformidadId == null) {
      this.resultDialog = false;
      this.openDialog('Error Datos', 'Hubo un error en la carga de datos. ¿Desea abrir el registro igual?');
    }

    // let antiguedadEnDias = DateHelper.calculateDiffDays(new Date, DateHelper.ansiToDate(this.conformidad.fecIncidente));
    if (this.userAcceso == 1 && !this.esEmpresa && this.conformidad.cerrado == 0 && this.conformidad.flgConforme == 1) {
      this.preCierre();
    }

    this.onChanges();

    let motivoSel = this.motivos.find(x => x.id == this.conformidad.terLiqMotivoReclamoId.toString());
    let importeLiquidado = this.conformidad.virImpLiquidado == 0 ? this.row.importe : this.conformidad.virImpLiquidado;

    this.conformidadForm.patchValue({
      fecIncidente: this.conformidad.fecIncidente,
      nroIncidente: this.conformidad.nroIncidente,
      conformidadId: this.conformidad.conformidadId,
      flgConforme: this.conformidad.flgConforme,
      motivoSeleccionado: motivoSel,
      importe: this.conformidad.importe,
      virImpLiquidado: importeLiquidado,
      virImpDiferencia: this.conformidad.virImpDiferencia,
      observaciones: this.conformidad.observaciones,
      respuesta: this.conformidad.respuesta,
      cerrado: this.conformidad.cerrado,
      flgRespuesta: this.conformidad.flgRespuesta,
    });

    this.conforimdadEstado = parseInt(this.row.conf);

    if (!(this.userAcceso == 3 && this.conforimdadEstado != 1) || this.conformidad.cerrado == 1) {
      this.controls.flgRespuesta.disable();
      this.controls.respuesta.disable();
    }

    // this.conforimdadEstado != 1 ???
    if (this.userAcceso != 1 || this.conformidad.cerrado == 1) {
      this.controls.flgConforme.disable();
    }
    this.controls.virImpLiquidado.disable();
  }

  preCierre() {
    let fecServerDate = new Date(this.conformidad.fecServer);
    let fecIncidenteDate = DateHelper.ansiToDate(this.conformidad.fecIncidente);
    let diaLimite = 8;
    // Test.
    // fecServerDate = DateHelper.ansiToDate('20201007');
    // feIncidenteDate = DateHelper.ansiToDate('20191231');

    let fecServerRestMonth = new Date(fecServerDate.setMonth(fecServerDate.getMonth() - 1));

    if (fecIncidenteDate.getFullYear() < fecServerRestMonth.getFullYear()
      || fecIncidenteDate.getMonth() < fecServerRestMonth.getMonth()
      || ((fecIncidenteDate.getMonth() == fecServerRestMonth.getMonth()) && (fecServerDate.getDate() > diaLimite))) {
          this.openDialog(
            'Atención',
            'No es posible modificar el estado de presentaciones de periodos anteriores al actual después del día ocho del mes.',
            'OK'
            );
          this.conformidad.cerrado = 1;
      }
  }

  //#region Read changes on controls for Enable or Disable anothers controls.
  onChanges(): void {
    this.controls.flgConforme.valueChanges.subscribe(val => {
      this.disabledMotivo();
      this.disabledImportes();
      this.disabledObservaciones();
    });

    this.controls.motivoSeleccionado.valueChanges.subscribe(val => {
      this.disabledImportes();
      this.disabledObservaciones();
    });
    this.controls.virImpDiferencia.valueChanges.subscribe(val => {
      this.cargarDiferencia('DIFERENCIA');
    });
    this.controls.importe.valueChanges.subscribe(val => {
      this.cargarDiferencia('ESPERADO');
    });

  }

  disabledMotivo() {
    if (this.condicion()) {
      this.controls.motivoSeleccionado.disable();
      this.controls.motivoSeleccionado.setValidators(null);
    } else {
      this.controls.motivoSeleccionado.enable();
      this.controls.motivoSeleccionado.setValidators([Validators.required], [Validators.minLength(3)]);
    }
  }

  disabledImportes() {
    if (this.condicion() || this.controls.motivoSeleccionado?.value?.flgCoPago == 1) {
      this.controls.importe.disable();
      this.controls.virImpDiferencia.disable();
      // this.controls.virImpLiquidado.disable();
    } else {
      this.controls.importe.enable();
      this.controls.virImpDiferencia.enable();
      // this.controls.virImpLiquidado.enable();
    }
  }

  disabledObservaciones() {
    if (this.condicion()) {
      this.controls.observaciones.disable();
      this.controls.observaciones.setValidators(null);
    } else {
      this.controls.observaciones.enable();
      this.controls.observaciones.setValidators([Validators.required]);
    }
  }

  condicion() {
    return (
      !(this.userAcceso == 1 &&
        this.controls.flgConforme.value == 0) ||
      this.conformidad.cerrado == 1);
  }
  //#endregion

  openDialog(pTitle: string, pContent: string, yesText = '', noText = ''): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: pTitle, content: pContent, yesText: yesText, noText: noText }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.resultDialog = result;
      if (!this.resultDialog) {
        this.dialogRef.close();
      }
      console.log(this.resultDialog);
    });
  }
  cargarDiferencia(campoEntrada: string) {
    if (!this.calculando) {
      this.calculando = true;
      if (campoEntrada == 'DIFERENCIA') {
        this.conformidadForm.patchValue({ importe: this.controls.virImpDiferencia.value + this.controls.virImpLiquidado.value });
      }
      if (campoEntrada == 'ESPERADO') {
        this.conformidadForm.patchValue({ virImpDiferencia: this.controls.importe.value - this.controls.virImpLiquidado.value });
      }
      this.calculando = false;
    }
  }

  guardarReclamo() {
    if (this.userAcceso === 1) {
      this.setConformidad();
    } else {
      this.setReclamo();
    }
  }

  setConformidad() {
    let flgConforme = this.controls.flgConforme.value;
    let motivo = 0;
    let obs = '';

    if (flgConforme == 0) {
      motivo = this.parseIntLocal( this.controls.motivoSeleccionado?.value?.id);
      if (motivo == 0) {
        this.commonService.showSnackBarFatal('Debe ingresar un motivo');
        return;
      }
      obs = this.controls.observaciones.value?.toString().trim();
      if (!obs) {
        this.commonService.showSnackBarFatal('Debe ingresar una observación');
        return;
      }
    }

    let difS: string = this.controls.virImpDiferencia.value.toString();
    let liqS: string = this.controls.virImpLiquidado.value.toString();
    let impS: string = this.controls.importe.value.toString();

    this.liquidacionesService.setConformidad(
      this.row.id, 0,
      flgConforme,
      motivo, difS, liqS, impS, obs
      ).subscribe(result => {
      if (result) {
        this.commonService.showSnackBarSucces('Guardado exitosamente.');
        this.dialogRef.close('updated');
      } else {
        this.commonService.showSnackBarFatal('Hubo un inconveniente, intente mas tarde.');
      }
    });
  }

  setReclamo() {
    this.liquidacionesService.setRespuesta(
      this.row.id,
      this.controls.flgRespuesta.value,
      this.controls.respuesta.value).subscribe(result => {
      if (result) {
        this.commonService.showSnackBarSucces('Guardado exitosamente.');
        this.dialogRef.close('updated');
      } else {
        this.commonService.showSnackBarFatal('Hubo un inconveniente, intente mas tarde.');
      }
    });

  }

  onNoClick(): void {
    this.dialogRef.close('cancel');
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

export interface RevisarPresentacionDialogData {
  element: Incidentes;
  esEmpresa: boolean;
}
