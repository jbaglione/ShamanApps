import { Component, OnInit, ElementRef, ViewChild, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';

import { listable } from '../../../models/listable.model';
import { Bitacora } from 'src/app/models/bitacora.model';
import { Registracion } from 'src/app/models/registracion.model';
import { Adjunto, AdjuntoGalery } from 'src/app/models/adjunto.model';
import { DialogComponent } from '../../shared/dialog/dialog.component';

import { BitacorasService } from '../bitacoras.service';
import { AuthenticationService } from '../../security/authentication.service';
import { CommonService } from '../../../services/common.service';
import { NgxGalleryComponent, NgxGalleryOptions, NgxGalleryImage } from 'ngx-gallery';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-bitacora-detail',
  templateUrl: './bitacora-detail.component.html',
  styleUrls: ['./bitacora-detail.component.css']
})

export class BitacoraDetailComponent implements OnInit {
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild('ta_reg_descripcion', {static: false}) ta_reg_descripcion: ElementRef;
  @ViewChild(NgxGalleryComponent, {static: false}) query: QueryList<NgxGalleryComponent>;

  idRegistracionSeleccionada = 0;

  bitacora: Bitacora = new Bitacora();
  motivos: listable;
  estados: listable;
  tempText: string;

  adjuntosGalery: AdjuntoGalery = new AdjuntoGalery();
  highlightedRows = [];

  dcRegistraciones: string[] = ['usuario', 'fecha', 'hora'];
  mtRegistraciones = new MatTableDataSource();

  bitacoraForm: FormGroup;

  resultDialog: boolean;
  // Usar si quiero mostrar el nuevo numero antes.
  newBitacoraNro: number;

  constructor(
    private bitacorasService: BitacorasService,
    private commonService: CommonService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    activatedRoute.params.subscribe(params => {
      this.bitacora.id = params['id'] === 'nuevo' ? 0 : parseFloat(params['id']);
      this.bitacorasService.GetMotivos().subscribe(data => this.motivos = data);
      this.bitacorasService.GetEstados().subscribe(data => this.estados = data);
      // Usar si quiero mostrar el nuevo numero antes.
      // this.bitacorasService.GetNewBitacoraNro().subscribe(data => this.newBitacoraNro = data);

      // Creo el formulario con ReactiveForm
      this.bitacoraForm = new FormGroup({
        // 'id': new FormControl({ value: '0', }, [Validators.required]),
        'numero': new FormControl({ value: '0', disabled: this.bitacora.id !== 0 }, [Validators.required]),
        'fecha': new FormControl({ value: new Date(), disabled: this.bitacora.id !== 0 }, [Validators.required]),
        'motivo': new FormControl({ value: '', disabled: this.bitacora.id !== 0 }, [Validators.required]),
        'titulo': new FormControl({ value: '', disabled: this.bitacora.id !== 0 }, [Validators.required, Validators.minLength(3)]),
        'estado': new FormControl({ value: '0', disabled: true }, [Validators.required]),

        // Panel Registraciones detalle:
        'reg_descripcion': new FormControl('', [Validators.required]),
      });

      if (this.bitacora.id !== 0) {
        this.bitacorasService.GetBitacora(this.bitacora.id).subscribe(data => {
          this.bitacora = data;
          this.loadBitacora();
          commonService.setTitulo('Bitacora ' + this.bitacora.titulo);
        });
      } else {
        commonService.setTitulo('Nueva Bitacora');
      }
    });
  }

  verRegistracion(row: any) {
    const that = this;
    const registracion = new Registracion();
    registracion.id = parseInt(row['id']);
    registracion.adjuntos = row['adjuntos'];
    registracion.descripcion = row['descripcion'];



    if (registracion.id !== 0 && this.bitacoraForm.controls.reg_descripcion.value === ''
      && this.bitacora.registraciones[this.bitacora.registraciones.length - 1].id === 0) {
      this.ta_reg_descripcion.nativeElement.focus();
      // this.ta_reg_descripcion.nativeElement.disable = false;
      this.bitacoraForm.controls.reg_descripcion.enable();
    } else {

      // Deshabilitar edicion.
      if (registracion.id !== 0) {
        this.bitacoraForm.controls.reg_descripcion.disable();
        if (this.idRegistracionSeleccionada == 0) {
          this.tempText = this.bitacoraForm.controls.reg_descripcion.value;
        }

        this.bitacoraForm.patchValue({
          reg_descripcion: registracion.descripcion,
        });
        // this.ta_reg_descripcion.nativeElement.disable = true;
      } else {
        // this.bitacoraForm.controls.reg_descripcion.setValue(this.tempText);
        this.bitacoraForm.patchValue({
          reg_descripcion:  this.tempText,
        });
        this.bitacoraForm.controls.reg_descripcion.enable();
        this.ta_reg_descripcion.nativeElement.focus();
      }

      this.highlightedRows = [];
      this.highlightedRows.push(row);
      this.idRegistracionSeleccionada = registracion.id;

      this.adjuntosGalery.adjuntos = new Array<Adjunto>();
      this.adjuntosGalery.galleryOptions = new Array<NgxGalleryOptions>();
      this.adjuntosGalery.galleryImages = new Array<NgxGalleryImage>();

      this.adjuntosGalery.adjuntos = registracion.adjuntos;
      if (this.adjuntosGalery.adjuntos != null && this.adjuntosGalery.adjuntos.length > 0) {
        // TODO: borrar
        // this.adjuntosGalery.adjuntos[0].fullPath = 'https://estaticos.elperiodico.com/resources/jpg/6/8/1530540262286.jpg';

        this.adjuntosGalery.galleryOptions = that.buildGalleryOptionsObject(this.adjuntosGalery);
        this.adjuntosGalery.adjuntos.forEach(function (adjunto) {
          // TODO: borrar
          // adjunto.fullPath = 'https://www.imagen.com.mx/assets/img/imagen_share.png';
          that.adjuntosGalery.galleryImages.push(that.buildGalleryImage(adjunto.fullPath));
        });
      } else {
        // if(this.adjuntosGalery.galleryOptions.length > 0)
        // this.adjuntosGalery.galleryOptions.forEach(function (option) {
        //   option.height = '0px';
        // });
        this.adjuntosGalery.galleryOptions = that.buildGalleryOptionsObject(this.adjuntosGalery);
      }
      console.log(registracion);
      console.log(this.idRegistracionSeleccionada);
    }

    // console.log(JSON.stringify(registracion));
  }



  loadBitacora() {

    if (this.bitacora.motivo == null || this.bitacora.estado == null || JSON.stringify(this.bitacora.registraciones) === '[]') {
      this.resultDialog = false;
      this.openDialog('Error Datos', 'Hubo un error en la carga de datos. ¿Desea abrir el registro igual?');
      return;
      // TODO: arreglar dialogo navegacion.
      // this.bitacorasService.showSnackBar('Error en los datos');
    }

    if (this.bitacora.registraciones == null || JSON.stringify(this.bitacora.registraciones) === '[]') {
      this.bitacora.registraciones.push(new Registracion());
      this.mtRegistraciones.data = this.bitacora.registraciones;
    } else {
      this.mtRegistraciones.data = this.bitacora.registraciones;
    }

    this.verRegistracion(this.bitacora.registraciones[this.bitacora.registraciones.length - 1]);

    // Seteo los valores del formulario. (parchValue=algunos, setValue=todos.)
    this.bitacoraForm.patchValue({
      // id: this.bitacora.id,
      numero: this.bitacora.nro,
      titulo: this.bitacora.titulo,
      fecha: this.bitacora.fecha,
      motivo: this.bitacora.motivo == null ? new listable('1', '') : this.bitacora.motivo.id,
      estado: this.bitacora.estado == null ? new listable('1', '') : this.bitacora.estado.id,
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
        this.router.navigate(['/bitacoras']);
      }
      console.log(this.resultDialog);
    });
  }
  ngOnInit() {
    this.mtRegistraciones.sort = this.sort;
  }

  nuevaRegistracion() {
    if (this.bitacora.registraciones.length === 9) {
      this.commonService.showSnackBar('No se pueden cargar mas registros a esta Bitacora');
      return;
    }

    this.bitacora.registraciones.push(new Registracion);
    this.mtRegistraciones.data = this.bitacora.registraciones;
    this.tempText = '';
    this.verRegistracion(this.bitacora.registraciones[this.bitacora.registraciones.length - 1]);
    this.ta_reg_descripcion.nativeElement.focus();
    this.bitacoraForm.controls.reg_descripcion.enable();
    console.log(this.bitacora);
  }

  guardarBitacora() {
    console.log(this.bitacoraForm.value);
    if (this.bitacoraForm.valid) {

      const indice: number = this.bitacora.registraciones.length - 1;

      if (this.bitacora.registraciones[indice].id == 0) {

        // this.bitacora.nro = this.bitacoraForm.controls.nro.value;
        this.bitacora.titulo = this.bitacoraForm.controls.titulo.value;
        this.bitacora.fecha = this.bitacoraForm.controls.fecha.value;
        this.bitacora.motivo = new listable(this.bitacoraForm.controls.motivo.value, '');
        this.bitacora.estado = new listable(this.bitacoraForm.controls.estado.value, '');

        this.bitacora.registraciones[indice].descripcion = this.bitacoraForm.controls.reg_descripcion.value;
        // this.bitacora.registraciones[indice].adjuntos = this.reg_adjuntos;
        this.bitacora.registraciones[indice].hora = new Date().toTimeString().substring(0, 5);
        this.bitacora.registraciones[indice].usuario = this.authenticationService.currentUserValue.nombre;
        // this.bitacora.registraciones = null;

        this.bitacorasService.CreateBitacora(this.bitacora).subscribe((newBitacora) => {

          if (newBitacora != null && newBitacora !== undefined) {
            console.log(JSON.stringify(newBitacora));
            this.bitacora = newBitacora as Bitacora;
            this.loadBitacora();
          }

        }, (response: Response) => {
          if (response.status === 500) {
            console.log('errorHasOcurred');
          }
        });
        // console.log(JSON.stringify(registracion));
      }
    }
  }

  recargarAdjuntos(event) {

    if (event === 'OK') {
      if (this.bitacora.id !== 0) {
        this.bitacorasService.GetBitacora(this.bitacora.id).subscribe(data => {
          this.bitacora.registraciones = data.registraciones;
          this.mtRegistraciones.data = this.bitacora.registraciones;
          this.verRegistracion(this.bitacora.registraciones.find(x => x.id == this.idRegistracionSeleccionada));
        });
      }
    }
  }
  GetNroRegistros(): number {
    // if (this.reg_adjuntos != null)
    //   return this.reg_adjuntos.length;
    // else return 0;
    if (this.adjuntosGalery != null && this.adjuntosGalery.adjuntos != null) {
      return this.adjuntosGalery.adjuntos.length;
    } else { return 0; }
  }

  isNew(): boolean {
    return this.bitacora.id === 0;
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
}

function download(adjuntoGalery: AdjuntoGalery): (event: Event) => void {
  if (adjuntoGalery.adjuntos != null && adjuntoGalery.adjuntos.length > 0) {
    return function (event, index) {
      saveAs(adjuntoGalery.galleryImages[index].medium.toString(), adjuntoGalery.adjuntos[index].name);
    }.bind(adjuntoGalery);
  }
}
