import { Component, OnInit, ElementRef, ViewChild, QueryList, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';

import { Listable } from '../../../models/listable.model';
import { Bitacora } from 'src/app/models/bitacora.model';
import { Registracion } from 'src/app/models/registracion.model';
import { Adjunto, AdjuntoGalery } from 'src/app/models/adjunto.model';
import { DialogComponent } from '../../shared/dialog/dialog.component';

import { BitacorasService } from '../bitacoras.service';
import { AuthenticationService } from '../../security/authentication.service';
import { CommonService } from '../../shared/services/common.service';
import { NgxGalleryComponent, NgxGalleryOptions, NgxGalleryImage } from '@kolkov/ngx-gallery';
import { saveAs } from 'file-saver';
import { take } from 'rxjs/operators';
import { async } from 'q';
import { ProgressBarService } from '@app/modules/shared/services/progress-bar.service';
import { SiteInfo } from '@app/models/site-info.model';

@Component({
  selector: 'app-bitacora-detail',
  templateUrl: './bitacora-detail.component.html',
  styleUrls: ['./bitacora-detail.component.css']
})

export class BitacoraDetailComponent implements OnInit {
  private sort: MatSort;

  bitacora: Bitacora = new Bitacora();
  bitacoraForm: FormGroup;

  motivos: Listable[];
  estados: Listable[];
  tempText: string;
  advertenciaMostrada = false;

  highlightedRows = [];

  dcRegistraciones: string[] = ['usuario', 'fecha', 'hora'];
  mtRegistraciones = new MatTableDataSource();
  idRegistracionSeleccionada = '0';

  haveNewImage: boolean;
  adjuntosGalery: AdjuntoGalery = new AdjuntoGalery();

  isLoading = false;
  resultDialog: boolean;
  regDescripcionEnable: boolean;
  rowid = -1;
  // Usar si quiero mostrar el nuevo numero antes.
  // newBitacoraNro: number;
  site: SiteInfo = new SiteInfo('bitacoras', 'Bitácoras', 'Bitácora', 'F');


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.mtRegistraciones.sort = this.sort;
  }
  @ViewChild('ta_reg_descripcion') ta_reg_descripcion: ElementRef;
  @ViewChild(NgxGalleryComponent) query: QueryList<NgxGalleryComponent>;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  constructor(
    private bitacorasService: BitacorasService,
    private commonService: CommonService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _ngZone: NgZone,
    private progressBarService: ProgressBarService
  ) {

    if (router.url.includes('hallazgos')) {
      this.site.url = 'hallazgos';
      this.site.nombre = 'Hallazgos';
      this.site.nombreSingular = 'Hallazgo';
      this.site.nombreGenero = 'M';
    }

    activatedRoute.params.subscribe(params => {
      this.bitacora.id = params['id'] === 'nuevo' || params['id'] === 'nueva' ? 0 : parseFloat(params['id']);

      this.setIsLoading(true);
      this.bitacorasService.GetEstados().subscribe(data => {
        this.setIsLoading(false);
        this.estados = data;
      });
    });
  }

  ngOnInit() {

    this.bitacoraForm = new FormGroup({
      numero: new FormControl({ value: '0', disabled: this.bitacora.id !== 0 }, [Validators.required]),
      fecha: new FormControl({ value: new Date(), disabled: this.bitacora.id !== 0 }, [Validators.required]),
      motivo: new FormControl({ value: '', disabled: this.bitacora.id !== 0 }, [Validators.required]),
      titulo: new FormControl({ value: '', disabled: this.bitacora.id !== 0 }, [Validators.required, Validators.minLength(3)]),
      estado: new FormControl({ value: '0', disabled: true }, [Validators.required]),
      // Panel Registraciones detalle:
      reg_descripcion: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });

    this.setIsLoading(true);
    this.bitacorasService.GetMotivos().subscribe(data => {
      this.setIsLoading(false);
      this.motivos = data;
      if (this.motivos.length == 1) {
        this.bitacoraForm.controls.motivo.setValue(this.motivos[0].id);
      }
    });

    // Usar si quiero mostrar el nuevo numero antes.
    // this.bitacorasService.GetNewBitacoraNro().subscribe(data => this.newBitacoraNro = data);
    if (this.bitacora.id !== 0) {
      const that = this;
      this.setIsLoading(true);
      this.bitacorasService.GetBitacora(this.bitacora.id).subscribe(data => {
        this.setIsLoading(false);
        this.bitacora = this.SetNewBitacora(data);
        this.loadBitacora();
        this.commonService.setTitulo(this.site.nombreSingular + this.bitacora.titulo);
      });
    } else {
      this.commonService.setTitulo(this.site.nombreGenero == 'M' ? 'Nuevo' : 'Nueva' + this.site.nombreSingular);
      this.regDescripcionEnable = true;
    }
    // this.mtRegistraciones.sort = this.sort;
    this.adjuntosGalery.galleryOptions = new Array<NgxGalleryOptions>();
  }

  verRegistracion(row: any) {
    const that = this;
    const registracion = new Registracion();
    registracion.id = row['id'];
    registracion.adjuntos = row['adjuntos'];
    registracion.descripcion = row['descripcion'];

    if (registracion.id !== '0' && this.bitacoraForm.controls.reg_descripcion.value === ''
      && this.bitacora.registraciones[this.bitacora.registraciones.length - 1].id == '0') {

      this.dialog.open(DialogComponent, {
        width: '300px',
        data: { title: 'Advertencia', content: '¿Desea descartar la nueva registración?', yesText: 'Mantener', noText: 'Descartar' }
      }).afterClosed().subscribe(result => {
        if (!result) {
          this.bitacora.registraciones.splice(this.bitacora.registraciones.length - 1);
          this.mtRegistraciones.data = this.bitacora.registraciones;
          this.verRegistracion(this.bitacora.registraciones[this.bitacora.registraciones.length - 1]);
        }
      });
      this.SetEnableRegistracion(true);
    } else {

      // Deshabilitar edicion.
      if (registracion.id != '0') {
        if (this.idRegistracionSeleccionada == '0') {
          this.tempText = this.bitacoraForm.controls.reg_descripcion.value;
        }

        this.bitacoraForm.patchValue({
          reg_descripcion: registracion.descripcion,
        });
        this.SetEnableRegistracion(false);

      } else {
        this.bitacoraForm.patchValue({
          reg_descripcion:  this.tempText,
        });
        this.SetEnableRegistracion(true);
      }

      this.highlightedRows = [];
      this.highlightedRows.push(row);
      this.idRegistracionSeleccionada = registracion.id;
      this.bitacora.idForAjdSubEnt = registracion.id.toString();

      this.SetGalery(registracion, that);
    }
  }

  loadBitacora() {

    if (this.bitacora.motivo == null || this.bitacora.estado == null || JSON.stringify(this.bitacora.registraciones) === '[]') {
      this.resultDialog = false;
      this.openDialogError('Error Datos', 'Hubo un error en la carga de datos. ¿Desea abrir el registro igual?');
      return;
    }

    if (this.bitacora.registraciones == null || JSON.stringify(this.bitacora.registraciones) === '[]') {
      this.bitacora.registraciones.push(new Registracion());
    }
    this.verRegistracion(this.bitacora.registraciones[this.bitacora.registraciones.length - 1]);

    this.mtRegistraciones.data = this.bitacora.registraciones;
    this.mtRegistraciones.sort = this.sort;

    // Seteo los valores del formulario. (parchValue=algunos, setValue=todos.)
    this.bitacoraForm.patchValue({
      // id: this.bitacora.id,
      numero: this.bitacora.nro,
      titulo: this.bitacora.titulo,
      fecha: this.bitacora.fecha,
      motivo: this.bitacora.motivo == null ? new Listable('1', '') : this.bitacora.motivo.id,
      estado: this.bitacora.estado == null ? new Listable('1', '') : this.bitacora.estado.id,
    });
  }

  openDialogError(pTitle: string, pContent: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: pTitle, content: pContent, noText: 'No', yesText: 'Si'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resultDialog = result;
      if (!this.resultDialog) {
        this.router.navigate([`/${this.site.url}`]);
      }
    });
  }

  nuevaRegistracion() {
    if (this.bitacora.registraciones.length === 9) {
      this.commonService.showSnackBar(`No se pueden cargar mas registros a ${(this.site.nombreGenero == 'M' ? 'este' : 'esta') + this.site.nombreSingular}`);
      return;
    }
    if (this.bitacora.registraciones[this.bitacora.registraciones.length - 1].id === '0') {
        this.ta_reg_descripcion.nativeElement.focus();
        this.commonService.showSnackBar('Tiene una Registración sin guardar');
        return;
      }
    this.bitacora.registraciones.push(new Registracion);
    this.mtRegistraciones.data = this.bitacora.registraciones;
    this.tempText = '';
    this.verRegistracion(this.bitacora.registraciones[this.bitacora.registraciones.length - 1]);
    this.SetEnableRegistracion(true);

  }

  async backPage() {
    if (this.bitacora.registraciones[this.bitacora.registraciones.length - 1].id == '0') {

      if (await this.dialog.open(DialogComponent, { width: '300px', data: {
          title: 'Advertencia', content: 'Tiene una Registración sin guardar ¿Desea salir de todos modos? ',
          yesText: 'Salir', noText: 'Seguir editando'}}).afterClosed().toPromise()) {
            this.router.navigate([`/${this.site.url}`]);
      }
    } else {
      this.router.navigate([`/${this.site.url}`]);
    }
  }

  async guardarBitacora() {
    this.markFormGroupTouched(this.bitacoraForm);

    if (this.bitacoraFormValidCustom()) {
      if (await this.Confirmar()) {
        const indice: number = this.bitacora.registraciones.length - 1;

        if (this.bitacora.registraciones[indice].id == '0') {
          this.bitacora.titulo = this.bitacoraForm.controls.titulo.value;
          this.bitacora.fecha = this.bitacoraForm.controls.fecha.value;
          this.bitacora.motivo = new Listable(this.bitacoraForm.controls.motivo.value, '');
          this.bitacora.estado = new Listable(this.bitacoraForm.controls.estado.value, '');

          this.bitacora.registraciones[indice].descripcion = this.bitacoraForm.controls.reg_descripcion.value;
          this.bitacora.registraciones[indice].hora = new Date().toTimeString().substring(0, 5);
          this.bitacora.registraciones[indice].usuario = this.authenticationService.currentUser.nombre;
          this.bitacora.isHallazgo = this.site.nombre == 'Hallazgos';
          const that = this;
          this.setIsLoading(true);
          this.bitacorasService.CreateBitacora(this.bitacora, this.site).subscribe((newBitacora) => {
            if (newBitacora != null && newBitacora !== undefined) {
              // this.bitacora = this.SetNewBitacora(newBitacora as Bitacora);
              // this.loadBitacora();
              this.router.navigate([`/${this.site.url}`]);
            }
            this.setIsLoading(false);
          }, error => {
            this.setIsLoading(false);
            if (this.bitacora.id == 0) {
              this.router.navigate([`/${this.site.url}`]);
            } else {
              this.ngOnInit();
            }
            throw error;
          });
        }
      }
    }
  }

  async Confirmar() {
    if (!this.advertenciaMostrada) {
      this.advertenciaMostrada = true;
      return await this.dialog.open(DialogComponent, {
        width: '300px',
        data: {
          title: 'Advertencia', content: 'Si guarda la Registración ya no podra editarla ni agregarle imagenes',
          yesText: 'Guardar', noText: 'Seguir editando'
        }
      }).afterClosed().toPromise();
    } else {
      return Promise.resolve(true);
    }
  }

  bitacoraFormValidCustom(): boolean {
    // this.bitacoraForm.valid allready return false if a control requiered is disabled.
    // if is necesary check all properties one by one
    if (this.bitacora.id !== 0) {
      if (!this.bitacoraForm.valid && !this.haveNewImage) {
        this.commonService.showSnackBar('No hay cambios para guardar.');
        return false;
      }
    } else if (!this.bitacoraForm.valid) {
        return false;
    }
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

  recargarAdjuntos(event) {
    const that = this;
    this.setIsLoading(true);
    if (event === 'OK') {
        this.bitacorasService.GetImages(this.bitacora.idForAjd, this.bitacora.idForAjdSubEnt).subscribe(data => {
          const indice: number = this.bitacora.registraciones.length - 1;
          let regSel = this.bitacora.registraciones.find(x => x.id == this.idRegistracionSeleccionada);
          if (regSel.id == '0') {
            this.bitacora.registraciones[indice].descripcion = this.bitacoraForm.controls.reg_descripcion.value;
            this.bitacora.registraciones[indice].hora = new Date().toTimeString().substring(0, 5);
            this.bitacora.registraciones[indice].usuario = this.authenticationService.currentUser.nombre;
            regSel = this.bitacora.registraciones[indice];
          }
          regSel.adjuntos = data;

          this.mtRegistraciones.data = this.bitacora.registraciones;
          this.haveNewImage = true;
          this.SetGalery(regSel, that);
          this.setIsLoading(false);
        });
    }
  }

  GetNroRegistros(): number {
    if (this.adjuntosGalery != null && this.adjuntosGalery.adjuntos != null) {
      return this.adjuntosGalery.adjuntos.length;
    } else { return 0; }
  }

  SetNewBitacora(data: Bitacora): Bitacora {
    return new Bitacora(
      data.id,
      data.nro,
      data.fecha,
      data.hora,
      data.titulo,
      data.motivo,
      data.administrador,
      data.estado,
      data.ultFechaHora,
      data.diasRta,
      data.duracion,
      data.registraciones
    );
  }

  private SetEnableRegistracion(enabled: boolean) {
    if (enabled) {
      this.ta_reg_descripcion.nativeElement.focus();
      this.bitacoraForm.controls.reg_descripcion.enable();
      this.regDescripcionEnable = true;
    } else {
      this.bitacoraForm.controls.reg_descripcion.disable();
      this.regDescripcionEnable = false;
    }
  }

  onMouseOver(element) {
    this.rowid = element.id; // this.mtBitacoras.data.findIndex(x => x.id == element.id);
    console.log(this.rowid);
  }

  //#region Galery
  private SetGalery(registracion: Registracion, that: this) {
    this.adjuntosGalery.adjuntos = new Array<Adjunto>();
    this.adjuntosGalery.galleryOptions = new Array<NgxGalleryOptions>();
    this.adjuntosGalery.galleryImages = new Array<NgxGalleryImage>();
    this.adjuntosGalery.adjuntos = registracion.adjuntos;
    if (this.adjuntosGalery.adjuntos != null && this.adjuntosGalery.adjuntos.length > 0) {
      this.adjuntosGalery.galleryOptions = that.buildGalleryOptionsObject(this.adjuntosGalery);
      this.adjuntosGalery.adjuntos.forEach(function (adjunto) {
        that.adjuntosGalery.galleryImages.push(that.buildGalleryImage(adjunto.fullPath));
      });
    } else {
      this.adjuntosGalery.galleryOptions = that.buildGalleryOptionsObject(this.adjuntosGalery);
    }
  }

  buildGalleryOptionsObject(adjuntoGalery: AdjuntoGalery): NgxGalleryOptions[] {
    return [{
      image: false,
      thumbnails: true,
      // width: '100% !important',
      height: adjuntoGalery.adjuntos != null && adjuntoGalery.adjuntos.length > 0 ? '145px' : '0px',
      previewDownload: false,
      previewZoom: true,
      previewRotate: true,
      previewSwipe: true,
      previewFullscreen: true,
      previewCloseOnEsc: true,
      previewKeyboardNavigation: true,
      previewBullets: true,
      previewZoomMax: 10,
      actions: [{
        icon: 'fa fa-download',
        disabled: false,
        titleText: 'Descargar',
        onClick: download(adjuntoGalery)
      }]
    }];
  }

  buildGalleryImage(imageFullPath: string): NgxGalleryImage {
    return {
      small: imageFullPath,
      medium: imageFullPath,
      big: imageFullPath,
      description: ''
    };
  }
//#endregion

setIsLoading(isDownloading: boolean, info = '' ) {
  if (isDownloading) {
    this.isLoading = true;
    this.progressBarService.activarProgressBar(info);
  } else {
    this.isLoading = false;
    this.progressBarService.desactivarProgressBar();
  }
}

}

function download(adjuntoGalery: AdjuntoGalery): (event: Event) => void {
  if (adjuntoGalery.adjuntos != null && adjuntoGalery.adjuntos.length > 0) {
    return function (event, index) {
      saveAs(adjuntoGalery.galleryImages[index].medium.toString(), adjuntoGalery.adjuntos[index].name);
    }.bind(adjuntoGalery);
  }
}

