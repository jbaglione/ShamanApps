import { Component, Inject, ChangeDetectorRef, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Auditoria } from '../../models/auditoria';
import { AuditoriasMovilesService } from '../../auditorias-moviles.service';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { Listable } from '../../../../models/listable.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auditoria-detail',
  templateUrl: './auditoria-detail.component.html',
  styleUrls: ['./auditoria-detail.component.css']
})

export class AuditoriaDetailComponent implements OnInit{

  idRegistracionSeleccionada = 0;
  auditoria: Auditoria = new Auditoria();
  tiposAuditoria: Listable;

  moviles: Listable;
  choferes: Listable;
  medicos: Listable;
  enfermeros: Listable;
  bases: Listable;
  prestadores: Listable;

  auditoriaForm: FormGroup;
  resultDialog: boolean;
  // Usar si quiero mostrar el nuevo numero antes.
  newAuditoriaNro: number;

  @ViewChild('myInput', {static: false})
  myInputVariable: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<AuditoriaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: AuditoriasDialogData,
    private auditoriasMovilesService: AuditoriasMovilesService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.auditoria.id = dialogData.id === 'nuevo' ? 0 : parseFloat(dialogData.id);
    // this.auditoria.dominioId = parseFloat(dialogData.clienteId);
    this.auditoriasMovilesService.GetMoviles().subscribe(data => this.moviles = data);
    this.auditoriasMovilesService.GetChoferes().subscribe(data => this.choferes = data);
    this.auditoriasMovilesService.GetMedicos().subscribe(data => this.medicos = data);
    this.auditoriasMovilesService.GetEnfermeros().subscribe(data => this.enfermeros = data);
    this.auditoriasMovilesService.GetBasesOperativas().subscribe(data => this.bases = data);
    this.auditoriasMovilesService.GetPrestadores().subscribe(data => this.prestadores = data);

    this.auditoriaForm = new FormGroup({
      fecha: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
      movil: new FormControl({ value: null, disabled: this.auditoria.id !== 0 }, [Validators.required]),
      chofer: new FormControl({ value: null, disabled: this.auditoria.id !== 0 }),
      medico: new FormControl({ value: null, disabled: this.auditoria.id !== 0 }),
      enfermero: new FormControl({ value: null, disabled: this.auditoria.id !== 0 }),
      base: new FormControl({ value: null, disabled: this.auditoria.id !== 0 }),
      prestador: new FormControl({ value: null, disabled: this.auditoria.id !== 0 }),
      condicion: new FormControl({ value: null, disabled: true }),
      tipoAuditoria: new FormControl({ value: null, disabled: true })
      // observaciones: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]),
    });

    // Nota: valido porque no se necesitan nuevas propiedades.
    if (dialogData.elemento != null) {
      this.auditoria = JSON.parse(JSON.stringify(dialogData.elemento));
      this.loadAuditoria();
    } else if (this.auditoria.id !== 0) {
      this.auditoriasMovilesService.GetAuditoria(this.auditoria.id).subscribe(data => {
        if (data !== undefined) {
          this.auditoria = data;
          this.loadAuditoria();
        } else {
          this.dialogRef.close('Error');
        }
      });
    }
  }

  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.auditoriaForm.controls.movil.valueChanges.subscribe(change => {
      this.auditoriasMovilesService.GetTiposAuditoria(this.auditoriaForm.controls.movil.value)
        .subscribe(data => this.tiposAuditoria = data);
    });
  }

  reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = '';
    console.log(this.myInputVariable.nativeElement.files);
  }

  // eliminarAdjuntoActual() {
  //   this.auditoria.adjunto = new ClienteAdjuntos();
  //   this.auditoriaForm.patchValue({
  //     adjuntoArchivo: null
  //   });
  // }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      if (event.target.files[0].type !== 'application/pdf') {
        alert(event.target.files[0].name + ' no es un archivo pdf valido');
        event.target.files = null;
        this.reset();
        this.cd.markForCheck();
        return;
      }
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.auditoriaForm.patchValue({
          adjuntoArchivo: reader.result
        });
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  loadAuditoria() {
    if (this.auditoria.fecha == null) {
      this.resultDialog = false;
      this.openDialog('Error Datos', 'Hubo un error en la carga de datos. ¿Desea abrir el registro igual?');
      // TODO: arreglar dialogo navegacion.
      // this.commonservices.showSnackBar('Error en los datos');
    }

    this.auditoriaForm.patchValue({
      fecha: this.auditoria.fecha,
      // tipoAuditoria: this.auditoria.tipoAuditoria == null ? new listable('1', '') : this.auditoria.tipoAuditoria.id,
      // observaciones: this.auditoria.observaciones,
      // fechaRecontacto: this.auditoria.fechaRecontacto,
      // adjuntoArchivo: this.auditoria.adjunto.archivo
    });
  }

  openDialog(pTitle: string, pContent: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: pTitle, content: pContent }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.resultDialog = result;
      // TODO: arreglar dialogo navegacion.
      if (!this.resultDialog) {
        this.dialogRef.close();
      }
      console.log(this.resultDialog);
    });
  }

  onNoClick(): void {
    this.dialogRef.close('ok');
  }

  iniciarAuditoria() {
    console.log(this.auditoriaForm.value);
    if (this.auditoriaForm.valid) {

      this.auditoria.fecha = this.auditoriaForm.controls.fecha.value;
      // this.auditoria.tipoAuditoria = new listable(this.auditoriaForm.controls.tipoAuditoria.value, '');
      // this.auditoria.observaciones = this.auditoriaForm.controls.observaciones.value;
      // this.auditoria.fechaRecontacto = this.auditoriaForm.controls.fechaRecontacto.value;
      // this.auditoria.adjunto.archivo = this.auditoriaForm.controls.adjuntoArchivo.value;

      this.auditoriasMovilesService.CreateAuditoria(this.auditoria).subscribe((newAuditoria) => {
        console.log(JSON.stringify(newAuditoria));
        if (newAuditoria !== undefined) {
          this.dialogRef.close('updated');
        }
      });
    }
  }
}

export interface AuditoriasDialogData {
  id: string;
  clienteId: string;
  acceso: string;
  elemento: Auditoria;
}
