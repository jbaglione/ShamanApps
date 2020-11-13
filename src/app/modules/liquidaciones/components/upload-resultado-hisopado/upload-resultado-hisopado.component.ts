import { Component, Inject, ViewChild, OnInit, LOCALE_ID, ChangeDetectorRef, ElementRef, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LiquidacionesService } from '../../liquidaciones.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from '@app/modules/shared/dialog/dialog.component';
import { AuthenticationService } from '@app/modules/security/authentication.service';
import { Incidentes } from '../../models';
import { CommonService } from '@app/modules/shared/services/common.service';
import { ResultadoLaboratorio } from '../../models/resultado-hisopado.model';
import { Listable, ListableNumber } from '@app/models/listable.model';
import { FileService } from '@app/modules/shared/services/files.service';
import { MatStepper } from '@angular/material/stepper';
import { UploadResultadoHisopadoDialogData } from '../../models/upload-resultado-hisopado-dialog-data.model';
import { DateHelper } from '@app/modules/shared/helpers/DateHelper';
import { PacientesCovidService } from '@app/modules/pacientes-covid/pacientes-covid.service';


@Component({
  selector: 'app-upload-resultado-hisopado',
  templateUrl: './upload-resultado-hisopado.component.html',
  styleUrls: ['./upload-resultado-hisopado.component.css']
})

export class UploadResultadoHisopadoComponent implements OnInit {

  resultadoLaboratorio: ResultadoLaboratorio;
  motivos: Listable[];
  laboratorios: ListableNumber[];
  resultados: ListableNumber[] = [
    new ListableNumber(-1, ''),
    new ListableNumber(0, 'Negativo'),
    new ListableNumber(1, 'Positivo'),
    new ListableNumber(2, 'Indeterminado')];
  realizado: boolean;

  public minDate: Date | String;
  public maxDate: Date | String;

  incidente: Incidentes;
  titulo: string;

  realizadoForm: FormGroup;
  noRealizadoForm: FormGroup;

  @ViewChild('myInput')
  myFileInputVariable: ElementRef;

  formSend: boolean;
  lastFile: any;
  @Output() setIsWorkingEvent = new EventEmitter<boolean>();

  get f() { return this.realizadoForm.controls; }
  get fn() { return this.noRealizadoForm.controls; }

  get hasAdjunto() {
    return this.f.adjuntoFile != null &&
    this.f.adjuntoFile !== undefined &&
    this.f.adjuntoFile.value?.length > 0 &&
    this.f.adjuntoFileName.value?.length > 0;
  }
  get hasAdjuntoFn() {
    return this.fn.adjuntoFile != null &&
    this.fn.adjuntoFile !== undefined &&
    this.fn.adjuntoFile.value?.length > 0 &&
    this.fn.adjuntoFileName.value?.length > 0;
  }

  constructor(
    public dialogRef: MatDialogRef<UploadResultadoHisopadoComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: UploadResultadoHisopadoDialogData,
    private liquidacionesService: LiquidacionesService,
    public dialog: MatDialog,
    private commonService: CommonService,
    private pacientesCovidService: PacientesCovidService,
    private cd: ChangeDetectorRef,
    private fileService: FileService
  ) {
    this.incidente = this.dialogData.incidente;
    this.titulo = 'Resultado Hisopado Incidente: ' + this.incidente.nroIncidente + ' (' + this.incidente.fecIncidente + ')';

    this.noRealizadoForm = new FormGroup({
      motivoNoRealizado: new FormControl(),
      adjuntoFile: new FormControl(),
      adjuntoFileName: new FormControl()
    });

    this.realizadoForm = new FormGroup({
      fechaHora: new FormControl(this.incidente.realFecIncidente),
      resultado: new FormControl(),
      laboratorioId: new FormControl(),
      adjuntoFile: new FormControl(),
      adjuntoFileName: new FormControl()
    });
  }

  ngOnInit(): void {
    this.liquidacionesService.getMotivosNoRealizacion().subscribe(motivos => {
      this.motivos = motivos;
      });
    this.liquidacionesService.getLaboratorios(this.dialogData.incidente.id).subscribe(laboratorios => {
      this.laboratorios = laboratorios;
    });
    this.setValidatorsRealizadoForm();
    this.setValidatorsNoRealizadoForm();
  }

  setValidatorsNoRealizadoForm() {
    this.fn.motivoNoRealizado.setValidators([Validators.required]);
    this.fn.adjuntoFile.setValidators(Validators.required);
    this.fn.adjuntoFileName.setValidators(Validators.required);
  }

  setValidatorsRealizadoForm() {
    this.f.fechaHora.setValidators([Validators.required]);
    this.f.resultado.setValidators([Validators.required, Validators.min(0)]);
    if (this.laboratorios && this.laboratorios.length > 0) {
      this.f.laboratorioId.setValidators(Validators.required);
    } else {
      this.f.laboratorioId.setValue(0);
    }
    this.f.adjuntoFile.setValidators(Validators.required);
    this.f.adjuntoFileName.setValidators(Validators.required);

    this.minDate = this.incidente.realFecIncidente;
    this.maxDate = new Date();
  }

  setRealizado(realizado: boolean, stepper: MatStepper) {
    this.realizado = realizado;
    stepper.next();
  }

  onFileChange(event) {
    const reader = new FileReader();
    const that = this;

    if (event.target.files && event.target.files.length) {
      if (event.target.files[0].type != 'image/jpeg') {
        this.commonService.showSnackBar(event.target.files[0].name + ' no es una imagen valida');
        event.target.files = null;
        this.myFileInputVariable.nativeElement.value = '';
        this.cd.markForCheck();
        return;
      }
      const [file] = event.target.files;
      this.lastFile = file;
      reader.readAsDataURL(file);
      if (this.realizado) {
        this.f.adjuntoFileName.setValue(file?.name);
      } else {
        this.fn.adjuntoFileName.setValue(file?.name);
      }

      reader.onload = () => {
        if (this.realizado) {
        this.realizadoForm.patchValue({
          adjuntoFile: reader.result
        });
      } else {
        this.noRealizadoForm.patchValue({
          adjuntoFile: reader.result
        });
      }
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }


  aceptar() {
    this.formSend = true;
    let setSucces: boolean;
    let res = new ResultadoLaboratorio();
    if (this.realizado) {
      if (this.realizadoForm.invalid) {
        this.markFormGroupTouched(this.realizadoForm);
        return;
      } else {
          res = this.realizadoForm.value as ResultadoLaboratorio;
          res.fechaHoraString = DateHelper.dateToTimeStamp(res.fechaHora);
      }
    } else {
      if (this.noRealizadoForm.invalid) {
        this.markFormGroupTouched(this.noRealizadoForm);
        return;
      } else {
        res = this.noRealizadoForm.value as ResultadoLaboratorio;
      }
    }
    res.liquidacionId = this.parseIntLocal(this.dialogData.liquidacionId);
    res.incidenteId = this.parseIntLocal(this.dialogData.incidente.incidenteId);
    res.observaciones = '';
    this.setIsWorkingEvent.emit(true);
    this.liquidacionesService.setResultadoLaboratorio(res).subscribe(incidente => {
      this.setIsWorkingEvent.emit(false);
      this.showMessage(incidente);
    });
  }

  private showMessage(incidente: Incidentes) {
    if (incidente != null) {
      this.commonService.showSnackBarSucces('El resultado fue guardado correctamente.');
      this.setIsWorkingEvent.emit(true);
      this.pacientesCovidService.SendNotificacionUsuarioByIncidenteId(incidente.incidenteId).subscribe(send => {
        this.setIsWorkingEvent.emit(false);
        this.commonService.showSnackBarSucces('Se notifico por email al Paciente que el resultado se encuentra disponible.');
      });

      this.dialogRef.close(incidente);
    } else {
      this.commonService.showSnackBarFatal('Ocurrio un error al intentar guardar el resultado, intente mas tarde.');
    }
  }

  eliminarAdjuntoActual() {
    if (this.realizado) {
      this.realizadoForm.patchValue({
        adjuntoFile: null,
        adjuntoFileName: ''
      });
    } else {
      this.noRealizadoForm.patchValue({
        adjuntoFile: null,
        adjuntoFileName: ''
      });
    }
  }

  parseIntLocal(value): number {
    let num = Number(value);
    if (typeof num === 'number' && !Number.isNaN(num)) {
      return num;
    } else {
      return 0;
    }
  }

  openImage() {

    let data = this.realizado ? this.f.adjuntoFile.value : this.fn.adjuntoFile.value;

    data = data.toString().replace('data:image/jpeg;base64,', '');
    const file = this.fileService.base64ToBlob(data, 'image/jpeg');
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
